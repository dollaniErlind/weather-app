import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { City } from '../models/city';
import { WeatherService } from './weather.service';

@Injectable({
  providedIn: 'root'
})
export class CityListResolverService implements Resolve<City[]> {

  constructor(private weatherService: WeatherService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<City[]> | Observable<never> {
    return this.weatherService.getCityList().pipe(
      take(1),
      mergeMap((cityList: City[]) => {
        if (cityList) {
          return of(cityList);
        } else {
          this.router.navigate(['/weather-forecast']);
          return EMPTY;
        }
      })
    );
  }
}
