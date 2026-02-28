import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { User } from '../models/user';
import { StravaGear } from '../models/strava-gear';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'bikewear_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/api/auth`;

  private _currentUser = new BehaviorSubject<User | null>(this.loadUser());
  readonly currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) { }

  get currentUser(): User | null {
    return this._currentUser.value;
  }

  get isConnected(): boolean {
    return this._currentUser.value !== null;
  }

  getStravaRedirectUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/strava/redirect-url`);
  }

  exchangeCode(code: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/strava/callback`, { code }).pipe(
      tap(user => this.setUser(user))
    );
  }

  connect(stravaId: string, accessToken: string): Observable<User> {
    const payload: User = { id: 0, stravaId, accessToken };
    return this.http.post<User>(`${this.apiUrl}/login`, payload).pipe(
      tap(user => this.setUser(user))
    );
  }

  disconnect(): Observable<void> {
    const user = this._currentUser.value;
    // Always clear local state immediately — backend call is best-effort
    this.setUser(null);
    if (!user) {
      return of(undefined as void);
    }
    return this.http.post<void>(`${this.apiUrl}/logout`, user.id).pipe(
      catchError(() => of(undefined as void))
    );
  }

  getStravaBikes(userId: number): Observable<StravaGear[]> {
    return this.http.get<StravaGear[]>(`${this.apiUrl}/strava/bikes?userId=${userId}`);
  }

  private setUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    this._currentUser.next(user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof parsed['id'] === 'number' &&
        typeof parsed['stravaId'] === 'string' &&
        typeof parsed['accessToken'] === 'string'
      ) {
        return parsed as User;
      }
      return null;
    } catch {
      return null;
    }
  }
}