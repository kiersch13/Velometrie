import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Velometrie';
  isLanding = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Restore session from HttpOnly cookie silently on startup
    this.authService.loadCurrentUser();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.isLanding = (e as NavigationEnd).urlAfterRedirects === '/';
    });
    // check initial state
    this.isLanding = this.router.url === '/';
  }
}