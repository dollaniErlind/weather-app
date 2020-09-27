import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastService: ToastrService) {}

  /**
   * Handle api errors
   * @param error - The error we get from server response
   * @returns Observable which errors out the same error caught by catchError
   */
  handleError(error: HttpErrorResponse) {
    if (!navigator.onLine) {
      this.toastService.error('Opsss. It seams you have internet connection problems!');
    } else if (!error.error.message) {
      this.toastService.error('Something bad happened. Please try again later!');
    } else {
      this.toastService.error(error.error.message);
    }
    return throwError(error);
  }
}
