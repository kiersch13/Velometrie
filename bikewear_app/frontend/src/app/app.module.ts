import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import {
  LucideAngularModule,
  Bike, Settings, Plus, ArrowLeft, Pencil, Check,
  Inbox, AlertCircle, Loader2, CheckCircle2, XCircle,
  Unplug, Cable, Tag, Gauge, ArrowRight, Zap, RefreshCw, Trash2,
  Compass, Mountain, LogIn, UserPlus, LogOut, Sparkles, Search, X, Info,
  Wrench, Clock, CalendarDays, ChevronDown, User, Sliders,
  MoveRight, FolderPlus, FolderOpen, History, Circle
} from 'lucide-angular';

import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { BikeListComponent } from './components/bike-list/bike-list.component';
import { BikeDetailComponent } from './components/bike-detail/bike-detail.component';
import { AddBikeComponent } from './components/add-bike/add-bike.component';
import { WearPartFormComponent } from './components/wear-part-form/wear-part-form.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { TeilBibliothekComponent } from './components/teil-bibliothek/teil-bibliothek.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CredentialsInterceptor } from './interceptors/credentials.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    BikeListComponent,
    BikeDetailComponent,
    AddBikeComponent,
    WearPartFormComponent,
    SettingsComponent,
    AuthCallbackComponent,
    TeilBibliothekComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
      },
      defaultLanguage: 'de',
    }),
    LucideAngularModule.pick({
      Bike, Settings, Plus, ArrowLeft, Pencil, Check,
      Inbox, AlertCircle, Loader2, CheckCircle2, XCircle,
      Unplug, Cable, Tag, Gauge, ArrowRight, Zap, RefreshCw, Trash2,
      Compass, Mountain, LogIn, UserPlus, LogOut, Sparkles, Search, X, Info,
      Wrench, Clock, CalendarDays, ChevronDown, User, Sliders,
      MoveRight, FolderPlus, FolderOpen, History, Circle
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: { prefix: './assets/i18n/', suffix: '.json' },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
