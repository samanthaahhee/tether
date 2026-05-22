import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

/**
 * App-level biometric lock. When enabled, the app shows a lock screen
 * the moment it backgrounds, and requires Face ID / Touch ID /
 * passcode to unlock when foregrounded again.
 *
 * Design notes:
 * - The preference is stored in AsyncStorage so it survives across
 *   sign-outs (a user who sets a lock expects it to stay on).
 * - First foreground after enabling does NOT lock — the lock only
 *   takes effect from the NEXT background→foreground cycle, so the
 *   user doesn't immediately get prompted before they understand
 *   what they enabled.
 * - On enable, we run a one-off authenticateAsync to confirm the
 *   device has biometrics + the user can pass them. This prevents
 *   the user from locking themselves out of an app they can no
 *   longer enter.
 * - If biometrics aren't enrolled, LocalAuthentication falls back to
 *   the device passcode automatically. If neither exists, we refuse
 *   to enable.
 */

const PREF_KEY = 'app_lock_enabled';

type Ctx = {
  /** Whether the user has turned App Lock on in Settings. */
  enabled: boolean;
  /** Whether the app is currently locked (foreground + enabled + not yet unlocked). */
  locked: boolean;
  /** Whether the device supports biometric or passcode auth at all. */
  available: boolean;
  /** Toggle the preference. Runs a confirmation auth on enable. */
  setEnabled: (next: boolean) => Promise<{ ok: boolean; error?: string }>;
  /** Trigger an unlock attempt. Resolves true on success. */
  attemptUnlock: () => Promise<boolean>;
};

const AppLockContext = createContext<Ctx | null>(null);

export function AppLockProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const [locked, setLocked] = useState(false);
  const [available, setAvailable] = useState(false);
  const lastState = useRef<AppStateStatus>(AppState.currentState);
  const enabledRef = useRef(false);
  // First foreground after enabling shouldn't lock. This ref tracks
  // whether we've passed that "grace period."
  const armed = useRef(false);

  // Load saved preference + check device capability on mount.
  useEffect(() => {
    (async () => {
      const [storedRaw, hardware, enrolled] = await Promise.all([
        AsyncStorage.getItem(PREF_KEY).catch(() => null),
        LocalAuthentication.hasHardwareAsync().catch(() => false),
        LocalAuthentication.isEnrolledAsync().catch(() => false),
      ]);
      setAvailable(Boolean(hardware && enrolled));
      const stored = storedRaw === 'true';
      setEnabledState(stored);
      enabledRef.current = stored;
      // If app launches cold WITH lock enabled, lock immediately —
      // they're entering from a fully-closed state, treat that as
      // foreground-from-background.
      if (stored) {
        setLocked(true);
        armed.current = true;
      }
    })();
  }, []);

  // Listen to background ↔ foreground transitions.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = lastState.current;
      lastState.current = next;

      if (!enabledRef.current) return;

      // Backgrounded → arm the lock for next foreground.
      if (next.match(/inactive|background/) && prev === 'active') {
        armed.current = true;
        return;
      }

      // Foregrounded → if armed, lock the UI.
      if (next === 'active' && armed.current) {
        setLocked(true);
      }
    });
    return () => sub.remove();
  }, []);

  const attemptUnlock = useCallback(async (): Promise<boolean> => {
    try {
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Hey Otis',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });
      if (res.success) {
        setLocked(false);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const setEnabled = useCallback(async (next: boolean) => {
    if (!next) {
      // Disabling — require auth first so a third party who picks up
      // an unlocked phone can't silently turn off the lock.
      const ok = await attemptUnlock();
      if (!ok) return { ok: false, error: 'Authentication required to disable App Lock.' };
      await AsyncStorage.setItem(PREF_KEY, 'false').catch(() => {});
      setEnabledState(false);
      enabledRef.current = false;
      armed.current = false;
      return { ok: true };
    }

    // Enabling. Make sure the device CAN authenticate before we let
    // the user lock themselves into a hole.
    const [hardware, enrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    if (!hardware) return { ok: false, error: 'This device does not support biometric or passcode authentication.' };
    if (!enrolled) return { ok: false, error: 'Set up Face ID, Touch ID, or a device passcode in iOS Settings first.' };

    // Confirmation auth — proves the user can pass right now.
    const ok = await attemptUnlock();
    if (!ok) return { ok: false, error: 'Authentication did not succeed. App Lock not enabled.' };

    await AsyncStorage.setItem(PREF_KEY, 'true').catch(() => {});
    setEnabledState(true);
    enabledRef.current = true;
    setAvailable(true);
    // Don't arm immediately — the user just authenticated. Arming
    // happens on the next background event.
    armed.current = false;
    return { ok: true };
  }, [attemptUnlock]);

  return (
    <AppLockContext.Provider value={{ enabled, locked, available, setEnabled, attemptUnlock }}>
      {children}
    </AppLockContext.Provider>
  );
}

export function useAppLock(): Ctx {
  const ctx = useContext(AppLockContext);
  if (!ctx) throw new Error('useAppLock must be used within an AppLockProvider');
  return ctx;
}
