const USER_PROFILE_KEY = "userProfile";
const DISMISSED_AT_KEY = "sortingHatDismissedAt";
const SHOWN_THIS_SESSION_KEY = "sortingHatShownThisSession";

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  house: { id: string; name: string };
}

export function getUserProfile(): UserProfile | null {
  const raw = localStorage.getItem(USER_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

// The userId is derived deterministically from the email (SHA-256)
// instead of being generated at random: the same person must always
// resolve to the same userId in Amplitude, regardless of device or how
// many times they complete the Sorting Hat.
async function hashEmailToUserId(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createUserProfile(
  data: Omit<UserProfile, "userId">
): Promise<UserProfile> {
  const profile: UserProfile = {
    userId: await hashEmailToUserId(data.email),
    ...data,
  };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

// Forgets the saved profile ("log out"), so a second person on the same
// device can complete the Sorting Hat and get their own profile instead of
// inheriting this one.
export function clearUserProfile(): void {
  localStorage.removeItem(USER_PROFILE_KEY);
}

// The "already shown" flag lives in sessionStorage (cleared when the tab
// closes) because the idea is to not be invasive *within the same
// session*, but to ask again on a future visit. The timestamp in
// localStorage stays as a persistent record (useful as an event property
// once connected to Amplitude), it's not used to block the modal.
export function dismissSortingHat(): void {
  localStorage.setItem(DISMISSED_AT_KEY, new Date().toISOString());
  sessionStorage.setItem(SHOWN_THIS_SESSION_KEY, "true");
}

export function wasSortingHatShownThisSession(): boolean {
  return sessionStorage.getItem(SHOWN_THIS_SESSION_KEY) === "true";
}
