import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModeKey, SESSION_STEPS } from '../constants/data';

// Legacy storage keys — written by an earlier base64-obfuscation layer that was
// removed because it misrepresented security (see privacy policy, data-encryption
// section). We read them for backwards-compatibility so existing users don't lose
// their local cache on upgrade. New writes are plain JSON.
const LEGACY_STORAGE_PREFIX = 'tether_enc_';
function decodeLegacyIfNeeded(raw: string): string {
  if (!raw.startsWith(LEGACY_STORAGE_PREFIX)) return raw;
  try {
    const encoded = raw.slice(LEGACY_STORAGE_PREFIX.length);
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    return raw;
  }
}

export interface Message {
  role: 'ai' | 'user';
  text: string;
  id: string;
}

export interface UserProfile {
  name: string;
  attachment: string;
  conflict: string;
  love: string;
  window: string;
  need: string;
  context: string;
  onboarded: boolean;
  sawIntro: boolean;
  streak: number;
  aiConsentGiven: boolean;
  avatarColor: string;
  age: string;
}

export interface PartnerProfile {
  name: string;
  attachment: string;
  conflict: string;
  love: string;
  window: string;
  need: string;
}

export interface Session {
  id: string;
  name: string;
  status: 'active' | 'resolved' | 'archived';
  currentStep: ModeKey;
  unlockedSteps: ModeKey[];
  messages: Record<ModeKey, Message[]>;
  nvcDraft?: { obs: string; feel: string; need: string; request: string };
  reflection?: string;
  summary?: string;
  previousStatus?: 'active' | 'resolved';
  startDate: string;
  resolvedDate?: string;
}

export interface EmotionalCapture {
  id: string;
  sessionId: string;
  date: string;
  fromStep: ModeKey;
  score: number; // 1–5
}

export interface UserMemory {
  narrative: string;       // full narrative injected into AI system prompt
  sessionCount: number;    // how many sessions this is based on
  lastUpdated: string;     // ISO date
  growthMoments: string[]; // notable positive shifts observed
  recurringThemes: string[]; // patterns that keep coming back
}

export interface Learnings {
  reflections: { sessionId: string; text: string; date: string }[];
  partnerObservations: string[];
  relationshipPatterns: string[];
  emotionalCaptures: EmotionalCapture[];
}

interface AppState {
  profile: UserProfile;
  partnerProfile: PartnerProfile;
  messages: Record<string, Message[]>;
  sessionLog: { mode: ModeKey; text: string; date: string }[];
  currentMode: ModeKey;
  sessions: Session[];
  activeSessionId: string | null;
  learnings: Learnings;
  userMemory: UserMemory | null;
  completedFullAssessments: string[];
  crisisCountry: string;
  loaded: boolean;
}

type Action =
  | { type: 'SET_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_PARTNER_PROFILE'; payload: Partial<PartnerProfile> }
  | { type: 'ADD_MESSAGE'; mode: ModeKey; message: Message }
  | { type: 'SET_MODE'; mode: ModeKey }
  | { type: 'LOG_SESSION'; entry: { mode: ModeKey; text: string; date: string } }
  | { type: 'HYDRATE'; state: Partial<AppState> }
  | { type: 'SET_LOADED' }
  | { type: 'CREATE_SESSION' }
  | { type: 'SET_ACTIVE_SESSION'; sessionId: string | null }
  | { type: 'ADVANCE_STEP'; sessionId: string }
  | { type: 'GO_TO_STEP'; sessionId: string; step: ModeKey }
  | { type: 'ADD_SESSION_MESSAGE'; sessionId: string; step: ModeKey; message: Message }
  | { type: 'SET_NVC_DRAFT'; sessionId: string; draft: { obs: string; feel: string; need: string; request: string } }
  | { type: 'RESOLVE_SESSION'; sessionId: string; reflection: string }
  | { type: 'ADD_REFLECTION'; reflection: { sessionId: string; text: string; date: string } }
  | { type: 'ADD_PARTNER_OBSERVATION'; observation: string }
  | { type: 'ADD_RELATIONSHIP_PATTERN'; pattern: string }
  | { type: 'RENAME_SESSION'; sessionId: string; name: string }
  | { type: 'DELETE_SESSION'; sessionId: string }
  | { type: 'ARCHIVE_SESSION'; sessionId: string }
  | { type: 'UNARCHIVE_SESSION'; sessionId: string }
  | { type: 'ADD_EMOTIONAL_CAPTURE'; capture: EmotionalCapture }
  | { type: 'UPDATE_SESSION_SUMMARY'; sessionId: string; summary: string }
  | { type: 'SET_CRISIS_COUNTRY'; code: string }
  | { type: 'UPDATE_USER_MEMORY'; memory: UserMemory }
  | { type: 'COMPLETE_FULL_ASSESSMENT'; assessmentType: string };

const defaultProfile: UserProfile = {
  name: '',
  attachment: '',
  conflict: '',
  love: '',
  window: '',
  need: '',
  context: '',
  onboarded: false,
  sawIntro: false,
  streak: 0,
  aiConsentGiven: false,
  avatarColor: '#B8D8CA',
  age: '',
};

const defaultPartnerProfile: PartnerProfile = {
  name: '',
  attachment: '',
  conflict: '',
  love: '',
  window: '',
  need: '',
};

const initialState: AppState = {
  profile: defaultProfile,
  partnerProfile: defaultPartnerProfile,
  messages: { vent: [], understand: [], prepare: [], bridge: [] },
  sessionLog: [],
  currentMode: 'vent',
  sessions: [],
  activeSessionId: null,
  // Learnings start empty. Earlier we seeded dummy partnerObservations and
  // relationshipPatterns to make the Learnings tab feel "alive" pre-launch,
  // but real users saw fabricated content with no provenance — confusing
  // and potentially misleading. They're populated as the user actually
  // generates session reflections and pattern data.
  learnings: {
    reflections: [],
    partnerObservations: [],
    relationshipPatterns: [],
    emotionalCaptures: [],
  },
  userMemory: null,
  completedFullAssessments: [],
  crisisCountry: 'international',
  loaded: false,
};

function updateSession(sessions: Session[], sessionId: string, updater: (s: Session) => Session): Session[] {
  return sessions.map((s) => (s.id === sessionId ? updater(s) : s));
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'SET_PARTNER_PROFILE':
      return { ...state, partnerProfile: { ...state.partnerProfile, ...action.payload } };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.mode]: [...(state.messages[action.mode] || []), action.message],
        },
      };
    case 'SET_MODE':
      return { ...state, currentMode: action.mode };
    case 'LOG_SESSION':
      return { ...state, sessionLog: [action.entry, ...state.sessionLog].slice(0, 50) };
    case 'HYDRATE': {
      const saved = action.state as any;
      return {
        ...initialState,
        ...saved,
        sessions: saved.sessions || [],
        activeSessionId: saved.activeSessionId || null,
        learnings: {
          ...initialState.learnings,
          ...(saved.learnings || {}),
          partnerObservations: saved.learnings?.partnerObservations || [],
          relationshipPatterns: saved.learnings?.relationshipPatterns || [],
        },
        userMemory: saved.userMemory || null,
        completedFullAssessments: saved.completedFullAssessments || [],
        crisisCountry: saved.crisisCountry || 'international',
        partnerProfile: saved.partnerProfile || defaultPartnerProfile,
        loaded: true,
      };
    }
    case 'SET_LOADED':
      return { ...state, loaded: true };

    case 'CREATE_SESSION': {
      const newSession: Session = {
        id: Date.now().toString(),
        name: '',
        status: 'active',
        currentStep: 'vent',
        unlockedSteps: ['vent'],
        messages: { vent: [], understand: [], prepare: [], bridge: [] },
        startDate: new Date().toISOString(),
      };
      return {
        ...state,
        sessions: [newSession, ...state.sessions],
        activeSessionId: newSession.id,
      };
    }

    case 'SET_ACTIVE_SESSION':
      return { ...state, activeSessionId: action.sessionId };

    case 'ADVANCE_STEP': {
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => {
          const idx = SESSION_STEPS.indexOf(s.currentStep);
          if (idx < 0 || idx >= SESSION_STEPS.length - 1) return s;
          const nextStep = SESSION_STEPS[idx + 1];
          return {
            ...s,
            currentStep: nextStep,
            unlockedSteps: s.unlockedSteps.includes(nextStep)
              ? s.unlockedSteps
              : [...s.unlockedSteps, nextStep],
          };
        }),
      };
    }

    case 'GO_TO_STEP': {
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => {
          if (!s.unlockedSteps.includes(action.step)) return s;
          return { ...s, currentStep: action.step };
        }),
      };
    }

    case 'ADD_SESSION_MESSAGE':
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => ({
          ...s,
          messages: {
            ...s.messages,
            [action.step]: [...(s.messages[action.step] || []), action.message],
          },
        })),
      };

    case 'SET_NVC_DRAFT':
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => ({
          ...s,
          nvcDraft: action.draft,
        })),
      };

    case 'RESOLVE_SESSION':
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => ({
          ...s,
          status: 'resolved' as const,
          reflection: action.reflection,
          resolvedDate: new Date().toISOString(),
        })),
        activeSessionId: null,
      };

    case 'ADD_REFLECTION':
      return {
        ...state,
        learnings: {
          ...state.learnings,
          reflections: [action.reflection, ...state.learnings.reflections],
        },
      };

    case 'ADD_PARTNER_OBSERVATION':
      return {
        ...state,
        learnings: {
          ...state.learnings,
          partnerObservations: [action.observation, ...state.learnings.partnerObservations].slice(0, 20),
        },
      };

    case 'ADD_RELATIONSHIP_PATTERN':
      return {
        ...state,
        learnings: {
          ...state.learnings,
          relationshipPatterns: [action.pattern, ...state.learnings.relationshipPatterns].slice(0, 20),
        },
      };

    case 'RENAME_SESSION':
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => ({
          ...s,
          name: action.name,
        })),
      };

    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.sessionId),
        activeSessionId: state.activeSessionId === action.sessionId ? null : state.activeSessionId,
        learnings: {
          ...state.learnings,
          reflections: state.learnings.reflections.filter((r) => r.sessionId !== action.sessionId),
          emotionalCaptures: state.learnings.emotionalCaptures.filter((c) => c.sessionId !== action.sessionId),
        },
      };

    case 'ARCHIVE_SESSION':
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => ({
          ...s,
          previousStatus: s.status === 'archived' ? s.previousStatus : (s.status as 'active' | 'resolved'),
          status: 'archived',
        })),
        activeSessionId: state.activeSessionId === action.sessionId ? null : state.activeSessionId,
      };

    case 'UNARCHIVE_SESSION':
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => ({
          ...s,
          status: s.previousStatus || 'resolved',
          previousStatus: undefined,
        })),
      };

    case 'UPDATE_SESSION_SUMMARY':
      return {
        ...state,
        sessions: updateSession(state.sessions, action.sessionId, (s) => ({
          ...s,
          summary: action.summary,
        })),
      };

    case 'UPDATE_USER_MEMORY':
      return { ...state, userMemory: action.memory };

    case 'ADD_EMOTIONAL_CAPTURE':
      return {
        ...state,
        learnings: {
          ...state.learnings,
          emotionalCaptures: [action.capture, ...state.learnings.emotionalCaptures].slice(0, 100),
        },
      };

    case 'SET_CRISIS_COUNTRY':
      return { ...state, crisisCountry: action.code };

    case 'COMPLETE_FULL_ASSESSMENT':
      return {
        ...state,
        completedFullAssessments: state.completedFullAssessments.includes(action.assessmentType)
          ? state.completedFullAssessments
          : [...state.completedFullAssessments, action.assessmentType],
      };

    default:
      return state;
  }
}

const StateContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem('tether_state').then((raw) => {
      if (raw) {
        try {
          // Legacy rows were base64-obfuscated; new rows are plain JSON. Handle both.
          const decoded = decodeLegacyIfNeeded(raw);
          const saved = JSON.parse(decoded);
          dispatch({ type: 'HYDRATE', state: { ...initialState, ...saved, loaded: true } });
        } catch {
          dispatch({ type: 'SET_LOADED' });
        }
      } else {
        dispatch({ type: 'SET_LOADED' });
      }
    });
  }, []);

  useEffect(() => {
    if (state.loaded) {
      const { loaded, ...toSave } = state;
      AsyncStorage.setItem('tether_state', JSON.stringify(toSave));
    }
  }, [state]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
