import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/shared/common.service';
import { Router } from '@angular/router';
import { ErrorhandlerService } from '../../services/errorhandler/errorhandler.service';
import { DataService } from '../../services/shared/data.service';
import { SuccessHandlerService } from '../../services/successhandler/success-handler.service';
import { ErrorsValidation } from '../../models/errors-validation';
import { RegistrationFormData } from '../../models/registration-form-data';
import { ApiResponse } from '../../models/api-response';
import {FormHelpersService} from "../../services/shared/form-helpers.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  private readonly _registrationForm: FormGroup;
  private _isLoading = false;
  constructor(
    private formBuilder: FormBuilder,
    private errorHandlerService: ErrorhandlerService,
    private _router: Router,
    private customerService: CustomerService,
    private successHandlerService: SuccessHandlerService,
    private commonService: CommonService,
    private dataService: DataService,
    private formHelperService: FormHelpersService,
    private _cd: ChangeDetectorRef // add the ChangeDetectorRef
  ) {
    this._registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required,this.commonService.noWhitespaceValidator]],
      lastName: ['', [Validators.required,this.commonService.noWhitespaceValidator]],
      userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20),
        this.commonService.noWhitespaceValidator]]});
  }
  formSubmit(): void {
    if (this.registrationForm.invalid) return;
    const formData = this.registrationForm.value; // extract the form data
    this._isLoading = true;
    this.subscribeRegisteredUser(formData);
  }
  isPhoneNumber(value: string) {
    const phoneRegex = /^\d{10}$/; // regex to match a 10-digit phone number
    return phoneRegex.test(value);
  }
  get isLoading(): boolean {
    return this._isLoading;
  }
  get registrationForm(): FormGroup {
    return this._registrationForm;
  }
  subscribeRegisteredUser(formData: RegistrationFormData) {
    this.customerService.registerUser(formData).subscribe({
      next: (value) => {
        this.successHandlerService.handleSuccessEvent(value.message);
        this._registrationForm.reset();
        this.navigateUserBasedOnVerification(value, formData);
      },
      error: (err) => {
        this.errorHandlerService.handleError(err);
        this._isLoading = false; // hide the spinner
        this._cd.detectChanges();
      },
    });
  }
  navigateUserBasedOnVerification(value: ApiResponse, formData: RegistrationFormData) {
    if (value.object.verificationCodeSent) {
      this.dataService.setUserName(formData.userName);
      this._router
        .navigate(['/verification/', value.object.verificationLink], {
          queryParams: {
            customerId: value.object.id,
          },
        })
        .then((r) => {
          this._isLoading = false;
          this._cd.detectChanges(); // force Angular to update the view
        });
    } else {
      this._isLoading = false;
      this._cd.detectChanges();
      this._router.navigate(['/login']);
    }
  }
  userNameVerificationControl(controlName: string): boolean{
    const userNameControl = this.registrationForm.get(controlName);
    if (userNameControl) return userNameControl?.valid && userNameControl?.touched && this.isPhoneNumber(userNameControl.value);
    return false;
  }
  isInvalidControl(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    if (control) return this.formHelperService.isInvalidControl(control);
    return false;
  }
  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (control) return this.formHelperService.getErrorMessage(controlName,control);
    return '';
  }
  ngOnInit(): void {}
}
