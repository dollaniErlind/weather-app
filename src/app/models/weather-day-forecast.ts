/**
 * DayWeatherForecast interface
 */
import { Clouds } from './clouds';
import { Coord } from './coord';
import { Main } from './main';
import { Sys } from './sys';
import { Weather } from './weather';
import { Wind } from './wind';

export interface WeatherDayForecast {
  id: number;
  base: string;
  dt: number;
  name: string;
  visibility: number;
  clouds: Clouds;
  coord: Coord;
  main: Main;
  sys: Sys;
  weather: Array<Weather>;
  wind: Wind;
}
