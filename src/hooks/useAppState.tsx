import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModeKey } from '../constants/data';

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

interface AppState {
  profile: UserProfile;
  messages: Record<ModeKey, Message[]>;
  sessionLog: { mode: ModeKey; text: string; date: string }[];
  currentMode: ModeKey;
  loaded: boolean;
}

type Action =
  | { type: 'SET_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_MESSAGE'; mode: ModeKey; message: Message }
  | { type: 'SET_MODE'; mode: ModeKey }
  | { type: 'LOG_SESSION'; entry: { mode: ModeKey; text: string; date: string } }
  | { type: 'HYDRATE'; state: AppState }
  | { type: 'SET_LOADED' };

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

const initialState: AppState = {
  profile: defaultProfile,
  messages: { vent: [], understand: [], prepare: [], nurture: [] },
  sessionLog: [],
  currentMode: 'vent',
  loaded: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
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
    case 'HYDRATE':
      return { ...action.state, loaded: true };
    case 'SET_LOADED':
      return { ...state, loaded: true };
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
