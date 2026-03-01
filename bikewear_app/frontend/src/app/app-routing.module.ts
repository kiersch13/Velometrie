import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { BikeListComponent } from './components/bike-list/bike-list.component';
import { BikeDetailComponent } from './components/bike-detail/bike-detail.component';
import { AddBikeComponent } from './components/add-bike/add-bike.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { TeilBibliothekComponent } from './components/teil-bibliothek/teil-bibliothek.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'bikes', component: BikeListComponent },
  { path: 'bikes/add', component: AddBikeComponent },
  { path: 'bikes/:id', component: BikeDetailComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'teilbibliothek', component: TeilBibliothekComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
