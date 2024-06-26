import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from "@angular/forms";

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
    if (!value) return null;
    if (emailRegex.test(value) || phoneRegex.test(value)) return null;
    return {invalidEmailOrPhone: true};
  }
  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.trim() !== value) return { whitespace: true };
    return null;
  }

  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const value = control.value;
    if (!value) return null;
    if (emailRegex.test(value)) return null;
    return {invalidEmail: true};
  }

  mobileNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const phoneRegex = /^\d{10}$/;
    const value = control.value;
    if (!value) return null;
    if (phoneRegex.test(value)) return null;
    return {invalidMobileNumber: true};
  }
}
