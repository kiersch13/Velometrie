import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import {
  LucideAngularModule,
  Bike, Settings, Plus, ArrowLeft, Pencil, Check,
  Inbox, AlertCircle, Loader2, CheckCircle2, XCircle,
  Unplug, Cable, Tag, Gauge, ArrowRight, Zap, RefreshCw
} from 'lucide-angular';

import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { BikeListComponent } from './components/bike-list/bike-list.component';
import { BikeDetailComponent } from './components/bike-detail/bike-detail.component';
import { AddBikeComponent } from './components/add-bike/add-bike.component';
import { WearPartFormComponent } from './components/wear-part-form/wear-part-form.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    BikeListComponent,
    BikeDetailComponent,
    AddBikeComponent,
    WearPartFormComponent,
    SettingsComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    LucideAngularModule.pick({
      Bike, Settings, Plus, ArrowLeft, Pencil, Check,
      Inbox, AlertCircle, Loader2, CheckCircle2, XCircle,
      Unplug, Cable, Tag, Gauge, ArrowRight, Zap, RefreshCw
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
