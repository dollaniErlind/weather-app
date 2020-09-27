import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherForecastRoutingModule } from './weather-forecast-routing.module';
import { ChartsModule } from 'ng2-charts';
import { WeatherForecastComponent } from '../../components/weather-forecast/weather-forecast.component';
import { ChartComponent } from '../../components/chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    WeatherForecastRoutingModule,
    ChartsModule
  ],
  declarations: [
    WeatherForecastComponent,
    ChartComponent
  ],
  exports: []
})
export class WeatherForecastModule {
}
