// Estas claves preparan el terreno para Amplitude (fase futura), aunque
// todavía no se integre ningún SDK:
// - anonymousId: id de dispositivo/sesión que se genera una sola vez y
//   persiste siempre, esté o no identificado el usuario. Es el id con el
//   que se trackearon los eventos previos a identificarse.
// - userProfile.userId: id propio del usuario identificado (distinto del
//   anonymousId). userProfile.anonymousId queda como referencia al id con
//   el que navegaba antes de completar el Sorting Hat, para poder unir
//   ("merge") el historial de eventos anónimo con el lifecycle del known
//   user una vez conectado Amplitude (identify + setDeviceId).
const ANONYMOUS_ID_KEY = "anonymousId";
const USER_PROFILE_KEY = "userProfile";
const DISMISSED_AT_KEY = "sortingHatDismissedAt";
const SHOWN_THIS_SESSION_KEY = "sortingHatShownThisSession";

export interface UserProfile {
  userId: string;
  anonymousId: string;
  firstName: string;
  lastName: string;
  email: string;
  house: { id: string; name: string };
}

export function getOrCreateAnonymousId(): string {
  const existing = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(ANONYMOUS_ID_KEY, id);
  return id;
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

// Genera un userId nuevo (no reutiliza el anonymousId) y guarda el
// anonymousId actual dentro del perfil como referencia de unificación.
export function createUserProfile(
  data: Omit<UserProfile, "userId" | "anonymousId">
): UserProfile {
  const profile: UserProfile = {
    userId: crypto.randomUUID(),
    anonymousId: getOrCreateAnonymousId(),
    ...data,
  };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

// El flag de "ya se mostró" vive en sessionStorage (se borra al cerrar la
// pestaña) porque la idea es no ser invasivo *dentro de la misma sesión*,
// pero sí volver a preguntar en una visita futura. El timestamp en
// localStorage queda como registro persistente (útil como propiedad de
// evento cuando se conecte Amplitude), no se usa para bloquear el modal.
export function dismissSortingHat(): void {
  localStorage.setItem(DISMISSED_AT_KEY, new Date().toISOString());
  sessionStorage.setItem(SHOWN_THIS_SESSION_KEY, "true");
}

export function wasSortingHatShownThisSession(): boolean {
  return sessionStorage.getItem(SHOWN_THIS_SESSION_KEY) === "true";
}
