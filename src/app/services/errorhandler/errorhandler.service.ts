import {ErrorHandler, Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ErrorhandlerService implements ErrorHandler {
  constructor() {
  }
  handleError(err: any) {
    let message: string;
    switch (typeof err) {
      case 'string':
        message = err;
        break;
      case 'object':
        if (!err.error) {
          message = 'Your request is taking longer time. Please try again after some time.';
        } else if (err.error.details != null && err.error.details.length != 0) {
          if (err.error.details[0] == '') {
            message = err.error.details[1]
          } else {
            message = err.error.details[0];
          }
        } else {
          message = err.error.message || 'Something went wrong.';
        }
        break;
      default:
        message = 'An unexpected error occurred. Please try again after some time.';
        break;
    }
    Swal.fire({
      title: message,
      icon: 'error',
      timer: 3000,
    });
    if (err.error instanceof ErrorEvent) {
      this.logError(message);
    }
  }

  private logError(errorMessage: string) {
    // log the error to the server
    // return this.http.post('/api/error-log-backend', error);
  }
}
