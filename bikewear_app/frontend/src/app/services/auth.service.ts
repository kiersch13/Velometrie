import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5059/api/auth';

  constructor(private http: HttpClient) { }

  login(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, user);
  }

  logout(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, userId);
  }
}