import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // Wait until the initial /api/auth/me check has completed before deciding.
    // Without this, on slow mobile networks the guard fires before loadCurrentUser()
    // resolves, sees isLoggedIn=false, and incorrectly redirects to /login even
    // though the user has a valid session cookie.
    return this.authService.authReady$.pipe(
      filter(ready => ready),
      take(1),
      map(() => {
        if (this.authService.isLoggedIn) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
