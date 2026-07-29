import * as amplitude from "@amplitude/unified";
import type { UserProfile } from "./identity";

// Cuts off sending to Amplitude without touching the rest of the code: set
// VITE_AMPLITUDE_TRACKING_ENABLED=false in .env to test visual/UI changes
// locally without generating events, and back to true (or unset) when you
// need them to reach the dashboard.
const TRACKING_ENABLED = process.env.VITE_AMPLITUDE_TRACKING_ENABLED !== "false";

// Centralized event names to avoid repeated loose strings (and typos) in
// every component that tracks something.
export const AnalyticsEvent = {
  PageViewed: "Page Viewed",
  DiscoverYourHouseClicked: "Discover Your House Clicked",
  SortingHatNotNowClicked: "Sorting Hat Not Now Clicked",
  SortingHatSubmitted: "Sorting Hat Form Submitted",
  ViewHouseClicked: "View House Clicked",
  BioViewed: "Bio Viewed",
  CastRandomSpellClicked: "Cast Random Spell Clicked",
  ProfileOpened: "Profile Opened",
  LoggedOut: "Logged Out",
} as const;

// Returns the underlying promise (resolves once the event has actually been
// enriched with the current device_id/user_id, not just queued) so callers
// that need to sequence an identity change after this specific event — e.g.
// logout — can await it instead of racing it. Fire-and-forget callers can
// just ignore the return value.
export function trackEvent(
  eventName: string,
  eventProperties?: Record<string, unknown>
): Promise<void> {
  if (!TRACKING_ENABLED) return Promise.resolve();
  return amplitude.track(eventName, eventProperties).promise.then(() => undefined);
}

// Links the following events to the deterministic userId (email hash) and
// attaches the profile data as user properties. Called both when
// completing the Sorting Hat and when reloading the app with an
// already-saved profile.
export function identifyUser(profile: UserProfile): void {
  if (!TRACKING_ENABLED) return;
  amplitude.setUserId(profile.userId);
  const identity = new amplitude.Identify()
    .set("first_name", profile.firstName)
    .set("last_name", profile.lastName)
    .set("email", profile.email)
    .set("house", profile.house.name);
  amplitude.identify(identity);
}

// Cuts any previous identity link on this device (setUserId to undefined +
// a new device_id) before identifying whoever just completed the Sorting
// Hat. Without this, if two different people use the same browser, the
// second one could inherit the first one's user_id instead of starting
// clean.
export function resetIdentity(): void {
  if (!TRACKING_ENABLED) return;
  amplitude.reset();
}
