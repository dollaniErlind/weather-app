/**
 * Weather list interface
 */
import { Clouds } from './clouds';
import { Main } from './main';
import { Weather } from './weather';
import { Wind } from './wind';
import { Rain } from './rain';
import { Snow } from './snow';
import { Sys5Day } from './sys-5-day';

export interface WeatherList {
  dt: number;
  dt_txt: string;
  clouds: Clouds;
  main: Main;
  weather: Array<Weather>;
  wind: Wind;
  rain: Rain;
  snow: Snow;
  sys: Sys5Day;
}
