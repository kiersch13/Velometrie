export interface User {
  id: number;
  email: string | null;
  anzeigename: string | null;
  /** First name from Strava profile (set on Strava connect). */
  vorname: string | null;
  /** True if this user has a Strava account connected. */
  stravaVerbunden: boolean;
}