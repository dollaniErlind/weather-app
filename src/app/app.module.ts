import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { CitySearchComponent } from './components/city-search/city-search.component';
import { cityReducer } from './store/city.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CitySearchComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    StoreModule.forRoot({
      cityReducer
    }),
    ToastrModule.forRoot({
      timeOut: 10000,
      closeButton: false,
      easeTime: 1000,
      disableTimeOut: false,
    }),
    NgProgressModule.withConfig({
      fixed: false,
      meteor: false,
      speed: 500,
      spinnerPosition: 'left',
      color: '#d6b600'
    }),
    NgProgressHttpModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
