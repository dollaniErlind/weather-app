/**
 * Weather5DayForecast interface
 */
import { City } from './city';
import { WeatherList } from './weather-list';

export interface Weather5DayForecast {
  city: City;
  cnt: number;
  cod: string;
  message: number;
  list: Array<WeatherList>;
}
