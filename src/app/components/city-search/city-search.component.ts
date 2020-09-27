import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { City } from '../../models/city';
import { AppState } from '../../app.state';
import * as CityActions from '../../store/city.actions';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.scss']
})
export class CitySearchComponent implements OnInit {
  citySearchForm: FormGroup;
  cities: Array<City> = [];
  selectedCityId: number;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>,
              private weatherService: WeatherService) {
    weatherService.getCityList().subscribe((response: City[]) => {
      this.cities = response;
    });
  }

  ngOnInit() {
    this.citySearchForm = this.formBuilder.group({
      city: null
    });
  }

  /**
   * Format a given result before display
   * @param result - The city object we are searching for
   * @returns string
   */
  formatter = (result: City) => result.name + ' - ' + result.country;

  /**
   * Transform the provided observable text into the array of results
   * @param text$ - The city text searched by the user
   * @returns Array<City>
   */
  searchForCity = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => {
        let filteredResults = (term === '') ? [] : this.cities.filter(city => city.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
        return filteredResults;
      })
    )

  /**
   * Emitted event when a match is selected
   * @param event - Event payload is of type NgbTypeaheadSelectItemEvent
   */
  selectedItem(event) {
    this.selectedCityId = event.item.id;
  }

  /**
   * Dispatch SetCityId action with selected city id payload
   */
  setSelectedCityId() {
    this.store.dispatch(new CityActions.SetCityId(this.selectedCityId));
  }

}
