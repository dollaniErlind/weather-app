import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: '/weather-forecast', pathMatch: 'full'
  },
  {
    path: 'weather-forecast',
    loadChildren: './modules/weather-forecast/weather-forecast.module#WeatherForecastModule'
  },
  {
    path: '**', redirectTo: '/weather-forecast',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
