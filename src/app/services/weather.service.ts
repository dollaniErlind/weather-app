import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { WeatherDayForecast } from '../models/weather-day-forecast';
import { Weather5DayForecast } from '../models/weather-5day-forecast';
import { ErrorService } from './error.service';
import { Main } from '../models/main';
import { WeatherList } from '../models/weather-list';
import { CitySearchResult } from '../models/city-search-result';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient: HttpClient,
              private errorService: ErrorService) {
  }

  /**
   * Find city by query string
   * @param query - input text from search city
   * @returns Observable<CitySearchResult>
   */
  findCity(query: string): Observable<CitySearchResult> {
    return this.httpClient.get<CitySearchResult>(environment.baseApi + 'find?q=' + query + '&type=like&sort=population&cnt=30&appid=' + environment.appId).pipe(
      catchError((httpError) => {
        return this.errorService.handleError(httpError);
      })
    );
  }

  /**
   * Get current weather forecast data
   * @param cityId - The selected city id
   * @param unit - The metric or imperial unit used as request parameter
   * @returns Observable<WeatherDayForecast>
   */
  getCurrentWeatherData(cityId: number, unit: string): Observable<WeatherDayForecast> {
    return this.httpClient.get<WeatherDayForecast>(environment.baseApi + 'weather/?appid=' + environment.appId + '&id=' + cityId + '&units=' + unit).pipe(
      map((dayForecast: WeatherDayForecast) => {
        dayForecast.dt *= 1000; // return date in milliseconds so we can display it using angular date pipe
        return dayForecast;
      }),
      catchError((httpError) => {
        return this.errorService.handleError(httpError);
      })
    );
  }

  /**
   * Get weather forecast data for 5 days
   * @param cityId - The selected city id
   * @param unit - The metric or imperial unit used as request parameter
   * @returns Observable<Weather5DayForecast>
   */
  get5DayForecastData(cityId: number, unit: string): Observable<Weather5DayForecast> {
    return this.httpClient.get(environment.baseApi + 'forecast/?appid=' + environment.appId + '&id=' + cityId + '&units=' + unit).pipe(
      map((forecastData: Weather5DayForecast) => {
        forecastData.list = forecastData.list.map(listItem => {
          listItem.dt *= 1000; // return date in milliseconds so we can display it using angular date pipe
          return listItem;
        });
        // calculate passed hours which are not returned by api, so we can simulate a chart even for today temperatures
        let startHour = (new Date().getDate() < new Date(forecastData.list[0].dt).getDate()) ? 24 : new Date(forecastData.list[0].dt).getHours() - 1;
        let missing3Hours = Math.floor(startHour / 3);
        let missingItems = [];
        for (let i = 0; i < missing3Hours; i++) {
          let missingItem = Object.assign({}, forecastData.list[(8 - missing3Hours) + i]);
          missingItem.dt = missingItem.dt - (24 * 60 * 60 * 1000);
          let date = new Date(missingItem.dt);
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let dayOfMonth = date.getDate();
          let hours = (date.getHours() - 1).toString();
          if (hours.toString().length === 1) {
            hours = '0' + hours;
          }
          missingItem.dt_txt = year + '-' + month + '-' + dayOfMonth + ' ' + hours + ':00:00';
          missingItems.push(missingItem);
        }
        forecastData.list.unshift(...missingItems);
        return forecastData;
      }),
      catchError((httpError) => {
        return this.errorService.handleError(httpError);
      })
    );
  }

  /**
   * Get average temperature
   * @param main - The property that keeps main weather data
   * @returns number | null
   */
  getAverageTemperature(main: Main): number | null {
    return main ? Math.round((main.temp_max + main.temp_min) / 2) : null;
  }

  /**
   * Get icon url
   * @param icon - The weather icon code
   * @returns string
   */
  getIconUrl(icon: string): string {
    return icon ? environment.iconBaseApi + icon + '.png' : '';
  }

  /**
   * Get most repeated list item
   * @param dayWeatherList - The array of list weather data for a specific day
   * @returns WeatherList
   */
  getMostRepeatedListItem(dayWeatherList: Array<WeatherList>): WeatherList {
    let usedItemsBasedOnWeatherId = {};
    let mostRepeatedWeatherListItem = null;
    let maxRepeated = 0;
    for (let listItem of dayWeatherList) {
      if (usedItemsBasedOnWeatherId[listItem.weather[0].id]) {
        usedItemsBasedOnWeatherId[listItem.weather[0].id]++;
      } else {
        usedItemsBasedOnWeatherId[listItem.weather[0].id] = 1;
      }
      if (maxRepeated < usedItemsBasedOnWeatherId[listItem.weather[0].id]) {
        mostRepeatedWeatherListItem = listItem;
        maxRepeated = usedItemsBasedOnWeatherId[listItem.weather[0].id];
      }
    }
    return mostRepeatedWeatherListItem;
  }

  /**
   * Get max temperature from a day weather list
   * @param dayWeatherList - The array of list weather data for a specific day
   * @returns number
   */
  getMaxTemperatureFromDayWeatherList(dayWeatherList: Array<WeatherList>): number {
    let maxTemp = Math.round(dayWeatherList[0].main.temp_max);
    for (let listItem of dayWeatherList) {
      let temp = Math.round(listItem.main.temp_max);
      if (maxTemp < temp) {
        maxTemp = temp;
      }
    }
    return maxTemp;
  }

  /**
   * Get min temperature from a day weather list
   * @param dayWeatherList - The array of list weather data for a specific day
   * @returns number
   */
  getMinTemperatureFromDayWeatherList(dayWeatherList): number {
    let minTemp = Math.round(dayWeatherList[0].main.temp_min);
    for (let listItem of dayWeatherList) {
      let temp = Math.round(listItem.main.temp_min);
      if (minTemp > temp) {
        minTemp = temp;
      }
    }
    return minTemp;
  }

  /**
   * Get average wind speed from a day weather list
   * @param dayWeatherList - The array of list weather data for a specific day
   * @returns number
   */
  getAverageWindSpeedFromDayWeatherList(dayWeatherList: Array<WeatherList>): number {
    let sum = 0;
    for (let listItem of dayWeatherList) {
      sum = sum + listItem.wind.speed;
    }
    return Math.round((sum / dayWeatherList.length) * 1e2) / 1e2;
  }

  /**
   * Get average humidity from a day weather list
   * @param dayWeatherList - The array of list weather data for a specific day
   * @returns number
   */
  getAverageHumidityFromDayWeatherList(dayWeatherList: Array<WeatherList>): number {
    let sum = 0;
    for (let listItem of dayWeatherList) {
      sum = sum + listItem.main.humidity;
    }
    return Math.round((sum / dayWeatherList.length) * 1e0) / 1e0;
  }

  /**
   * Get average pressure from a day weather list
   * @param dayWeatherList - The array of list weather data for a specific day
   * @returns number
   */
  getAveragePressureFromDayWeatherList(dayWeatherList: Array<WeatherList>): number {
    let sum = 0;
    for (let listItem of dayWeatherList) {
      sum = sum + listItem.main.pressure;
    }
    return Math.round((sum / dayWeatherList.length) * 1e0) / 1e0;
  }

  /**
   * Get city list from json file
   * @returns City[]
   */
  getCityList(): Observable<City[]> {
    return this.httpClient.get<City[]>('assets/city.list.min.json').pipe(
      catchError((httpError) => {
        return this.errorService.handleError(httpError);
      })
    );
  }
  
}
