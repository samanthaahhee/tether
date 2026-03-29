import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModeKey, SESSION_STEPS } from '../constants/data';

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
  streak: number;
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
  status: 'active' | 'resolved';
  currentStep: ModeKey;
  unlockedSteps: ModeKey[];
  messages: Record<ModeKey, Message[]>;
  nvcDraft?: { obs: string; feel: string; need: string; request: string };
  reflection?: string;
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
  | { type: 'ADD_SESSION_MESSAGE'; sessionId: string; step: ModeKey; message: Message }
  | { type: 'SET_NVC_DRAFT'; sessionId: string; draft: { obs: string; feel: string; need: string; request: string } }
  | { type: 'RESOLVE_SESSION'; sessionId: string; reflection: string }
  | { type: 'ADD_REFLECTION'; reflection: { sessionId: string; text: string; date: string } }
  | { type: 'ADD_PARTNER_OBSERVATION'; observation: string }
  | { type: 'ADD_RELATIONSHIP_PATTERN'; pattern: string }
  | { type: 'RENAME_SESSION'; sessionId: string; name: string }
  | { type: 'ADD_EMOTIONAL_CAPTURE'; capture: EmotionalCapture };

const defaultProfile: UserProfile = {
  name: '',
  attachment: '',
  conflict: '',
  love: '',
  window: '',
  need: '',
  context: '',
  onboarded: false,
  streak: 0,
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
  learnings: { reflections: [], partnerObservations: [], relationshipPatterns: [], emotionalCaptures: [] },
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
        learnings: { reflections: [], partnerObservations: [], relationshipPatterns: [], emotionalCaptures: [], ...(saved.learnings || {}) },
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

    case 'ADD_EMOTIONAL_CAPTURE':
      return {
        ...state,
        learnings: {
          ...state.learnings,
          emotionalCaptures: [action.capture, ...state.learnings.emotionalCaptures].slice(0, 100),
        },
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
          const saved = JSON.parse(raw);
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
