import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:5059/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    anzeigename: 'Test User',
    vorname: null,
    stravaVerbunden: false,
  };

  it('loadCurrentUser() sends a GET to /me and updates currentUser', () => {
    service.loadCurrentUser();

    const req = httpMock.expectOne(`${apiUrl}/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    expect(service.currentUser?.email).toBe('test@example.com');
    expect(service.isLoggedIn).toBe(true);
  });

  it('loadCurrentUser() silently swallows 401 and leaves currentUser null', () => {
    service.loadCurrentUser();

    const req = httpMock.expectOne(`${apiUrl}/me`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(service.currentUser).toBeNull();
    expect(service.isLoggedIn).toBe(false);
  });

  it('loadCurrentUser() silently swallows non-401 errors and leaves currentUser null', () => {
    service.loadCurrentUser();

    const req = httpMock.expectOne(`${apiUrl}/me`);
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(service.currentUser).toBeNull();
    expect(service.isLoggedIn).toBe(false);
  });

  it('register() sends a POST to /register with email and password', () => {
    service.register('new@example.com', 'password123').subscribe(user => {
      expect(user.email).toBe('new@example.com');
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.email).toBe('new@example.com');
    expect(req.request.body.password).toBe('password123');
    req.flush({ ...mockUser, email: 'new@example.com' });
  });

  it('register() updates currentUser after successful response', () => {
    service.register('new@example.com', 'password123').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/register`);
    req.flush({ ...mockUser, email: 'new@example.com' });

    expect(service.currentUser?.email).toBe('new@example.com');
  });

  it('login() sends a POST to /login with credentials', () => {
    service.login('test@example.com', 'password123').subscribe(user => {
      expect(user.email).toBe('test@example.com');
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.email).toBe('test@example.com');
    req.flush(mockUser);
  });

  it('login() updates currentUser after successful response', () => {
    service.login('test@example.com', 'password123').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/login`);
    req.flush(mockUser);

    expect(service.isLoggedIn).toBe(true);
    expect(service.currentUser?.id).toBe(1);
  });

  it('logout() sends a POST to /logout', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('logout() clears currentUser on success', () => {
    // First simulate a logged-in state
    service.login('test@example.com', 'password123').subscribe();
    httpMock.expectOne(`${apiUrl}/login`).flush(mockUser);

    service.logout().subscribe();
    httpMock.expectOne(`${apiUrl}/logout`).flush(null);

    expect(service.currentUser).toBeNull();
    expect(service.isLoggedIn).toBe(false);
  });

  it('logout() clears currentUser even on error', () => {
    service.login('test@example.com', 'password123').subscribe();
    httpMock.expectOne(`${apiUrl}/login`).flush(mockUser);

    service.logout().subscribe();
    httpMock.expectOne(`${apiUrl}/logout`).flush(null, { status: 500, statusText: 'Error' });

    expect(service.currentUser).toBeNull();
  });

  it('isStravaConnected returns true when stravaVerbunden is true', () => {
    service.login('strava@example.com', 'pass').subscribe();
    httpMock.expectOne(`${apiUrl}/login`).flush({ ...mockUser, stravaVerbunden: true });

    expect(service.isStravaConnected).toBe(true);
  });

  it('isStravaConnected returns false when user is not connected to Strava', () => {
    service.login('test@example.com', 'pass').subscribe();
    httpMock.expectOne(`${apiUrl}/login`).flush(mockUser);

    expect(service.isStravaConnected).toBe(false);
  });

  it('connectWithStrava() sends a GET to /strava/redirect-url', () => {
    service.connectWithStrava().subscribe(res => {
      expect(res.url).toContain('strava.com');
    });

    const req = httpMock.expectOne(`${apiUrl}/strava/redirect-url`);
    expect(req.request.method).toBe('GET');
    req.flush({ url: 'https://www.strava.com/oauth/authorize?...', state: 'abc123' });
  });

  it('connectStrava() sends a POST to /strava/callback', () => {
    service.connectStrava('auth-code', 'state-token').subscribe(user => {
      expect(user.stravaVerbunden).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/strava/callback`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.code).toBe('auth-code');
    req.flush({ ...mockUser, stravaVerbunden: true });
  });

  it('disconnectStrava() sends a DELETE to /strava/disconnect', () => {
    service.login('test@example.com', 'pass').subscribe();
    httpMock.expectOne(`${apiUrl}/login`).flush({ ...mockUser, stravaVerbunden: true });

    service.disconnectStrava().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/strava/disconnect`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(service.currentUser?.stravaVerbunden).toBe(false);
  });

  it('getStravaBikes() sends a GET with userId query param', () => {
    service.getStravaBikes(42).subscribe();

    const req = httpMock.expectOne('http://localhost:5059/api/strava/bikes?userId=42');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
