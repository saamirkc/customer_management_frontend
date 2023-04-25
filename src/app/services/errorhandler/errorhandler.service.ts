import {ErrorHandler, Injectable} from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class ErrorhandlerService implements ErrorHandler {
  constructor() {
  }

  handleError(err: any) {
    let errorMessage = '';
    if (typeof err === 'string') {
      Swal.fire({
        title: err,
        icon: 'error',
        timer: 3000
      });
    } else if (!err.error) {
      Swal.fire({
        title: 'Your request is taking longer time. Please try again after some time.',
        icon: 'error',
        timer: 3000
      });
    } else if (err.error.details != null && err.error.details.length != 0) {
      if (err.error.details[0] == "") {
        Swal.fire({
          title: err.error.details[1],
          icon: 'error',
          timer: 3000
        });
        errorMessage = `Error: ${err.error.details[1]}`;
      } else {
        Swal.fire({
          title: err.error.details[0],
          icon: 'error',
          timer: 3000
        });
        errorMessage = `Error: ${err.error.details[0]}`;
      }
      console.log("Error details ->", errorMessage)
    } else {
      Swal.fire({
        title: err.error.message,
        icon: 'error',
        timer: 3000
      });
      errorMessage = `Error: ${err.error.message}`;
      console.log("Error ->", errorMessage)
      // throw err;
    }
    if (err.error instanceof ErrorEvent) {
      this.logError(errorMessage);
    }
    // Return an observable with a user-facing error message.
    //   return throwError(()=>{
    //     throw new Error('Something bad happened; please try again later.')
    //   });
  };

  private logError(errorMessage: string) {
    // log the error to the server
    // return this.http.post('/api/error-log-backend', error);
  }
}
