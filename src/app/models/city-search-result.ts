/**
 * CitySearchResult interface
 */
import { CityWeatherList } from './city-weather-list';

export interface CitySearchResult {
  cod: string;
  count: number;
  message: string;
  list: Array<CityWeatherList>;
}