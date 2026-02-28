export interface User {
  id: number;
  stravaId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
  vorname?: string;
}