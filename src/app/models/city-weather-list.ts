/**
 * CityWeatherList interface
 */
import { WeatherList } from './weather-list';

export interface CityWeatherList extends WeatherList {
  id: number;
  name: string;
}
