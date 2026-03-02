import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    if (!this.email || !this.password) {
      this.error = 'Bitte E-Mail und Passwort eingeben.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/bikes']),
      error: (err) => {
        this.loading = false;
        const msg = err?.error;
        if (err?.status === 0) {
          this.error = 'Server nicht erreichbar. Bitte versuche es später erneut.';
        } else {
          this.error = typeof msg === 'string' && msg
            ? msg
            : 'Anmeldung fehlgeschlagen. Bitte prüfe deine Eingaben.';
        }
      }
    });
  }
}
