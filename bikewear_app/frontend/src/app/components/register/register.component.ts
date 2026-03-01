import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  anzeigename = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    if (!this.email || !this.password) {
      this.error = 'Bitte E-Mail und Passwort eingeben.';
      return;
    }
    if (this.password.length < 8) {
      this.error = 'Das Passwort muss mindestens 8 Zeichen lang sein.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.email, this.password, this.anzeigename || undefined).subscribe({
      next: () => this.router.navigate(['/bikes']),
      error: (err) => {
        this.loading = false;
        const msg = err?.error;
        this.error = typeof msg === 'string' && msg
          ? msg
          : 'Registrierung fehlgeschlagen. Bitte prüfe deine Eingaben.';
      }
    });
  }
}
