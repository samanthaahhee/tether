import PostHog from 'posthog-react-native';
import Constants from 'expo-constants';

// PostHog project API key (public, safe to ship in client). Read from
// EXPO_PUBLIC_POSTHOG_KEY so it can be rotated without a rebuild —
// stale builds gracefully no-op when the key is missing.
const POSTHOG_KEY =
  Constants.expoConfig?.extra?.posthogKey ||
  process.env.EXPO_PUBLIC_POSTHOG_KEY ||
  '';

const POSTHOG_HOST =
  Constants.expoConfig?.extra?.posthogHost ||
  process.env.EXPO_PUBLIC_POSTHOG_HOST ||
  'https://us.i.posthog.com';

// Singleton instance. If no key is configured, posthog stays null and
// every track/identify call becomes a no-op — this keeps dev/test
// environments clean and avoids accidental traffic to a wrong project.
const posthog: PostHog | null = POSTHOG_KEY
  ? new PostHog(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      // Start opted-out. We flip to opted-in only after the user passes
      // the consent gate in onboarding. This keeps us aligned with
      // GDPR/CCPA expectations — no event collection before consent.
      defaultOptIn: false,
      // Flush every 20 events or every 30s, whichever comes first.
      flushAt: 20,
      flushInterval: 30000,
    })
  : null;

/**
 * Record an event. No-op if PostHog isn't configured or the user
 * hasn't opted in yet (the SDK guards both internally, but we add a
 * runtime check so the rest of the app can call these freely).
 */
export function track(event: string, properties?: Record<string, any>) {
  posthog?.capture(event, properties);
}

/**
 * Link subsequent events to a user. Called on sign-in / sign-up.
 * Properties become user-level traits (visible on the Person page in
 * PostHog and queryable via cohorts).
 */
export function identify(userId: string, traits?: Record<string, any>) {
  posthog?.identify(userId, traits);
}

/**
 * Clear the local distinct ID and stop linking events to the prior
 * user. Call on sign-out so the next user doesn't inherit events.
 */
export function resetUser() {
  posthog?.reset();
}

/**
 * Flip the SDK from opted-out (default) to opted-in. Called from the
 * onboarding consent gate after the user accepts terms.
 */
export function enableTracking() {
  posthog?.optIn();
}

/**
 * Force opt-out (e.g. user revokes consent in Settings). Buffered
 * events are dropped.
 */
export function disableTracking() {
  posthog?.optOut();
}

export default posthog;
