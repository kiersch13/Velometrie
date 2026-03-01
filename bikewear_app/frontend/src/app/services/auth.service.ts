import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { User } from '../models/user';
import { StravaGear } from '../models/strava-gear';
import { environment } from '../../environments/environment';

const STRAVA_STATE_KEY = 'bikewear_strava_state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;

  private readonly _currentUser = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this._currentUser.value;
  }

  get isLoggedIn(): boolean {
    return this._currentUser.value !== null;
  }

  get isStravaConnected(): boolean {
    return this._currentUser.value?.stravaVerbunden === true;
  }

  /**
   * Called on app startup to restore the session from the server-side cookie.
   * Silently swallows 401 (not logged in).
   */
  loadCurrentUser(): void {
    this.http.get<User>(`${this.apiUrl}/me`).pipe(
      catchError(() => of(null))
    ).subscribe(user => this._currentUser.next(user));
  }

  // ── App-level auth ──────────────────────────────────────────────────────

  register(email: string, password: string, anzeigename?: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { email, password, anzeigename }).pipe(
      tap(user => this._currentUser.next(user))
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => this._currentUser.next(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this._currentUser.next(null)),
      catchError(() => {
        this._currentUser.next(null);
        return of(undefined as void);
      })
    );
  }

  // ── Strava connect ──────────────────────────────────────────────────────

  /**
   * Fetches the Strava OAuth redirect URL and the anti-forgery state token,
   * saves the state to sessionStorage, then navigates the browser to Strava.
   */
  connectWithStrava(): Observable<{ url: string; state: string }> {
    return this.http.get<{ url: string; state: string }>(`${this.apiUrl}/strava/redirect-url`);
  }

  redirectToStrava(): void {
    this.connectWithStrava().subscribe({
      next: ({ url, state }) => {
        sessionStorage.setItem(STRAVA_STATE_KEY, state);
        window.location.href = url;
      }
    });
  }

  /**
   * Exchanges the OAuth code and state received from Strava for a connected user.
   * The state is read from sessionStorage to validate the anti-forgery token.
   */
  connectStrava(code: string, stateFromUrl: string): Observable<User> {
    const storedState = sessionStorage.getItem(STRAVA_STATE_KEY) ?? '';
    sessionStorage.removeItem(STRAVA_STATE_KEY);
    return this.http.post<User>(`${this.apiUrl}/strava/callback`, {
      code,
      state: stateFromUrl || storedState
    }).pipe(
      tap(user => this._currentUser.next(user))
    );
  }

  disconnectStrava(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/strava/disconnect`).pipe(
      tap(() => {
        const user = this._currentUser.value;
        if (user) {
          this._currentUser.next({ ...user, stravaVerbunden: false, vorname: null });
        }
      })
    );
  }

  getStravaBikes(userId: number): Observable<StravaGear[]> {
    return this.http.get<StravaGear[]>(`${environment.apiBaseUrl}/api/strava/bikes?userId=${userId}`);
  }
}