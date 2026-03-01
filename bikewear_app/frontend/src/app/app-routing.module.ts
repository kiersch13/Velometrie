import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { BikeListComponent } from './components/bike-list/bike-list.component';
import { BikeDetailComponent } from './components/bike-detail/bike-detail.component';
import { AddBikeComponent } from './components/add-bike/add-bike.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { TeilBibliothekComponent } from './components/teil-bibliothek/teil-bibliothek.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'bikes', component: BikeListComponent, canActivate: [AuthGuard] },
  { path: 'bikes/add', component: AddBikeComponent, canActivate: [AuthGuard] },
  { path: 'bikes/:id', component: BikeDetailComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'teilbibliothek', component: TeilBibliothekComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
