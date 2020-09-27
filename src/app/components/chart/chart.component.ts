import { Component, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {
  @ViewChild('baseChart') chart: BaseChartDirective;
  @Input() dayWeatherDataList: Array<any>;
  @Input() cityId: number;
  previousCityId: number;
  previousSelectedDate: number;
  chartLabels: Array<string> = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
  chartData: Array<any> = [
    {data: [], label: 'Temperature'}
  ];
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      onClick: (event: any) => event.stopPropagation(),
    },
  };
  isBrowser: boolean;

  constructor(private weatherService: WeatherService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dayWeatherDataList && changes.dayWeatherDataList.currentValue && changes.dayWeatherDataList.currentValue.length > 0) {
      let selectedDate = this.dayWeatherDataList[0].dt;
      if ((this.previousCityId !== this.cityId) || (this.previousSelectedDate !== selectedDate)) {
        this.previousCityId = this.cityId;
        this.previousSelectedDate = selectedDate;
        this.updateChartData();
      }
    }
  }

  /**
   * Update chart data when selected day changes
   */
  updateChartData() {
    this.chartData[0].data = [];
    for (let listItem of this.dayWeatherDataList) {
      this.chartData[0].data.push(this.weatherService.getAverageTemperature(listItem.main));
    }
    if (this.chart !== undefined) {
      this.chart.datasets = this.chartData;
      this.chart.ngOnInit();
    }
  }
}
