import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from '../models/user';

const STORAGE_KEY = 'bikewear_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5059/api/auth';

  private _currentUser = new BehaviorSubject<User | null>(this.loadUser());
  readonly currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) { }

  get currentUser(): User | null {
    return this._currentUser.value;
  }

  get isConnected(): boolean {
    return this._currentUser.value !== null;
  }

  connect(stravaId: string, accessToken: string): Observable<User> {
    const payload: User = { id: 0, stravaId, accessToken };
    return this.http.post<User>(`${this.apiUrl}/login`, payload).pipe(
      tap(user => this.setUser(user))
    );
  }

  disconnect(): Observable<void> {
    const user = this._currentUser.value;
    if (!user) {
      this.setUser(null);
      return of(undefined as void);
    }
    return this.http.post<void>(`${this.apiUrl}/logout`, user.id).pipe(
      tap(() => this.setUser(null))
    );
  }

  /** @deprecated use connect() instead */
  login(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, user).pipe(
      tap(u => this.setUser(u))
    );
  }

  /** @deprecated use disconnect() instead */
  logout(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, userId).pipe(
      tap(() => this.setUser(null))
    );
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