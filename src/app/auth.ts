/**
 * Frontend-only demo authentication. No backend, no API — localStorage only.
 */
export const AUTH_KEY = "caconnect_demo_logged_in";

export const DEMO_EMAIL = "demo@caconnect.com";
export const DEMO_PASSWORD = "demo123";

export function readLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeLoggedIn(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(AUTH_KEY, "true");
    else window.localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}

export function checkCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
}
