import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Intercepts 401 Unauthorized responses from protected API endpoints and
 * redirects the user to the login page.  Auth-related endpoints (/api/auth/)
 * are excluded to avoid redirect loops (e.g. /api/auth/me returns 401 when
 * the user is simply not logged in yet).
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const isAuthEndpoint = request.url.includes('/api/auth/');
        if (err.status === 401 && !isAuthEndpoint) {
          this.authService.clearUser();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
