import {Injectable} from '@angular/core';
import {AbstractControl} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() {
  }
  emailOrPhoneValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const value = control.value;

    if (!value) {
      return null;
    }

    if (emailRegex.test(value) || phoneRegex.test(value)) {
      return null;
    } else {
      return {invalidEmailOrPhone: true};
    }
  }

}
