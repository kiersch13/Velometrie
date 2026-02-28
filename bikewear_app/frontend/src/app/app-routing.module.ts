import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BikeListComponent } from './components/bike-list/bike-list.component';
import { BikeDetailComponent } from './components/bike-detail/bike-detail.component';
import { AddBikeComponent } from './components/add-bike/add-bike.component';

const routes: Routes = [
  { path: '', redirectTo: 'bikes', pathMatch: 'full' },
  { path: 'bikes', component: BikeListComponent },
  { path: 'bikes/add', component: AddBikeComponent },
  { path: 'bikes/:id', component: BikeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
