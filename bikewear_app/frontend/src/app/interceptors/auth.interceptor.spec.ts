import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceMock: jest.Mocked<Pick<AuthService, 'clearUser'>>;
  let routerMock: jest.Mocked<Pick<Router, 'navigate'>>;

  beforeEach(() => {
    authServiceMock = { clearUser: jest.fn() };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('redirects to /login and clears user on 401 from a protected endpoint', () => {
    httpClient.get('/api/bike').subscribe({ error: () => {} });

    httpMock.expectOne('/api/bike').flush('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(authServiceMock.clearUser).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('does NOT redirect on 401 from /api/auth/ endpoints', () => {
    httpClient.get('/api/auth/me').subscribe({ error: () => {} });

    httpMock.expectOne('/api/auth/me').flush('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(authServiceMock.clearUser).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('does not redirect on non-401 errors', () => {
    httpClient.get('/api/bike').subscribe({ error: () => {} });

    httpMock.expectOne('/api/bike').flush('Server Error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
