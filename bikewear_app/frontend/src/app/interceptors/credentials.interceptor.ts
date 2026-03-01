import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Attaches `withCredentials: true` to every outgoing HTTP request so that
 * the HttpOnly session cookie is sent to the backend regardless of
 * cross-origin differences in local development.
 */
@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request.clone({ withCredentials: true }));
  }
}
