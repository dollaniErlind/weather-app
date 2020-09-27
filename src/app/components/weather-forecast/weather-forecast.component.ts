import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { WeatherService } from '../../services/weather.service';
import { AppState } from '../../app.state';
import { UnitEnum } from '../../enumerations/unit.enum';
import { WeatherDayForecast } from '../../models/weather-day-forecast';
import { Weather5DayForecast } from '../../models/weather-5day-forecast';
import { WeatherList } from '../../models/weather-list';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherForecastComponent {
  cityId: number;
  currentWeatherData: WeatherDayForecast = <WeatherDayForecast>{};
  currentAverageTemperature: number;
  selectedDayWeatherData: WeatherDayForecast = <WeatherDayForecast>{};
  forecastData: Weather5DayForecast;
  selectedUnit: string = UnitEnum.METRIC;
  week5days: Array<number> = [0, 1, 2, 3, 4];
  selectedDayIndex: number;
  selectedDayIconUrl = '';
  selectedDayWeatherMain: string;
  selectedDayWeatherDescription: string;
  selectedDayWindSpeed: number;
  selectedDayMainPressure: number;
  selectedDayMainHumidity: number;
  weather5DayDisplayData: Array<any> = [];

  constructor(private cdr: ChangeDetectorRef,
              private weatherService: WeatherService,
              private store: Store<AppState>) {
    for (let dayIndex of this.week5days) {
      this.weather5DayDisplayData.push({});
    }
    store.select('cityReducer').subscribe(cityId => {
      this.cityId = cityId;
      this.requestWeatherData();
    });
  }

  /**
   * Make the requests to get current weather data and weather forecast data for 5 days
   */
  requestWeatherData() {
    this.weatherService.getCurrentWeatherData(this.cityId, this.selectedUnit).subscribe((dayForecast: WeatherDayForecast) => {
      this.selectedDayIndex = 0;
      this.currentWeatherData = dayForecast;
      this.currentAverageTemperature = this.weatherService.getAverageTemperature(this.currentWeatherData.main);
      this.selectedDayWeatherData = Object.assign({}, this.currentWeatherData);
      this.initializeSelectedDayWeatherData();
      this.cdr.detectChanges();
    });
    this.weatherService.get5DayForecastData(this.cityId, this.selectedUnit).subscribe((forecastData: Weather5DayForecast) => {
      this.forecastData = forecastData;
      this.initialize5DayForecastData();
      this.cdr.detectChanges();
    });
  }

  /**
   * Assign proper values for selected day weather data
   */
  initializeSelectedDayWeatherData() {
    this.selectedDayIconUrl = this.weatherService.getIconUrl(this.selectedDayWeatherData.weather[0].icon);
    this.selectedDayWeatherMain = this.selectedDayWeatherData.weather[0].main;
    this.selectedDayWeatherDescription = this.selectedDayWeatherData.weather[0].description;
    this.selectedDayWindSpeed = this.selectedDayWeatherData.wind.speed;
    this.selectedDayMainPressure = this.selectedDayWeatherData.main.pressure;
    this.selectedDayMainHumidity = this.selectedDayWeatherData.main.humidity;
  }

  /**
   * Create array which keeps weather data to be displayed for each day
   */
  initialize5DayForecastData() {
    let currentAverageTemperature: number | null = this.weatherService.getAverageTemperature(this.selectedDayWeatherData.main);
    for (let dayIndex of this.week5days) {
      let dayWeatherList: Array<WeatherList> = this.getDayWeatherList(dayIndex);
      let mostRepeatedListItem: WeatherList = this.weatherService.getMostRepeatedListItem(dayWeatherList);
      let maxTemperature: number = this.weatherService.getMaxTemperatureFromDayWeatherList(dayWeatherList);
      if (this.selectedDayIndex === 0 && currentAverageTemperature && maxTemperature < currentAverageTemperature) {
        maxTemperature = currentAverageTemperature;
      }
      this.weather5DayDisplayData[dayIndex] = {
        date: dayWeatherList[0].dt,
        tempMax: maxTemperature,
        tempMin: this.weatherService.getMinTemperatureFromDayWeatherList(dayWeatherList),
        iconUrl: this.getIconUrlFromDayWeatherList(dayIndex, mostRepeatedListItem),
        weatherMain: mostRepeatedListItem.weather[0].main,
        weatherDescription: mostRepeatedListItem.weather[0].description
      };
    }
  }

  /**
   * Get list of weather data for a specific day
   * @param dayIndex - The day index we need to get weather data
   * @returns Array<WeatherList> | null
   */
  getDayWeatherList(dayIndex: number): Array<WeatherList> | null {
    return this.forecastData ? this.forecastData.list.slice(dayIndex * 8, (dayIndex + 1) * 8) : null;
  }

  /**
   * Get Icon url of most repeated weather condition in a day weather data list
   * @param dayIndex - The day index we need to get weather icon url
   * @param mostRepeatedListItem - The most repeated weather condition
   * @returns string
   */
  getIconUrlFromDayWeatherList(dayIndex: number, mostRepeatedListItem: WeatherList): string {
    if (dayIndex === 0 && this.currentWeatherData && this.currentWeatherData.weather) {
      return this.weatherService.getIconUrl(this.currentWeatherData.weather[0].icon);
    } else {
      let icon = mostRepeatedListItem.weather[0].icon;
      icon = icon.replace('n', 'd');
      return this.weatherService.getIconUrl(icon);
    }
  }

  /**
   * Show weather data for selected day
   * @param dayIndex - The index of selected day
   */
  showDayWeatherData(dayIndex: number) {
    this.selectedDayIndex = dayIndex;
    if (dayIndex === 0) {
      this.selectedDayWeatherData = Object.assign({}, this.currentWeatherData);
    } else {
      let selectedDayWeatherList: Array<WeatherList> = this.getDayWeatherList(this.selectedDayIndex);
      this.selectedDayWeatherData = Object.assign({}, this.selectedDayWeatherData, this.weatherService.getMostRepeatedListItem(selectedDayWeatherList));
      this.selectedDayWeatherData.wind.speed = this.weatherService.getAverageWindSpeedFromDayWeatherList(selectedDayWeatherList);
      this.selectedDayWeatherData.main.humidity = this.weatherService.getAverageHumidityFromDayWeatherList(selectedDayWeatherList);
      this.selectedDayWeatherData.main.pressure = this.weatherService.getAveragePressureFromDayWeatherList(selectedDayWeatherList);
      let icon: string = this.selectedDayWeatherData.weather[0].icon;
      this.selectedDayWeatherData.weather[0].icon = icon.replace('n', 'd');
    }
    this.initializeSelectedDayWeatherData();
  }

}
