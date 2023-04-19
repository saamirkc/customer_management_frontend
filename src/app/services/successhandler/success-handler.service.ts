import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class SuccessHandlerService {
  constructor() { }
  handleSuccessEvent(message: string){
    Swal.fire({
      title: message,
      icon: 'success',
      timer: 4000
    })
  }
}
