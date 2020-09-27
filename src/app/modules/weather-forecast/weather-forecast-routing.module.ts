import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeatherForecastComponent } from '../../components/weather-forecast/weather-forecast.component';

const routes: Routes = [
  {
    path: '',
    component: WeatherForecastComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeatherForecastRoutingModule {
}
