import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../shared/common.service';
import { TokenService } from '../../services/token/token.service';
import constants from '../../shared/constants';
import { ErrorhandlerService } from '../../services/errorhandler/errorhandler.service';
import { SuccessHandlerService } from '../../services/successhandler/success-handler.service';
import { ErrorsValidation } from '../../models/errors-validation';
import { LoginData } from '../../models/login-data';
import { ApiResponse } from '../../models/api-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private readonly _loginForm: FormGroup;
  private _isLoading = false;

  get loginForm(): FormGroup {
    return this._loginForm;
  }
  private _userNameErrors: ErrorsValidation = {
    required: 'Username is required',
    invalid: 'Please enter a valid email or phone number',
  };
  private _passwordErrors: ErrorsValidation = {
    required: 'Password is required',
    invalid: 'Password length must be minimum 6',
  };

  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private _cd: ChangeDetectorRef, private successHandlerService: SuccessHandlerService,
    private errorHandlerService: ErrorhandlerService, private loginService: LoginService, private router: Router,
    private dataService: DataService, private tokenService: TokenService
  ) {
    this._loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      loginType: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  formSubmit() {
    if (this._loginForm.invalid) return;
    const formData = this._loginForm.value; // extract form data
    this._isLoading = true;
    this.subscribeLoggedInUser(formData);
  }
  subscribeLoggedInUser(formData: LoginData) {
    this.loginService.login(formData).subscribe({
      next: (value) => {
        this.successHandlerService.handleSuccessEvent(value.message);
        this._loginForm.reset();
        this.setValuesInLocalStorage(value);
        this.navigateUserBasedOnRoles(value);
      },
      error: (err) => {
        this._isLoading = false;
        this._cd.detectChanges(); // force Angular to update the view
        this.errorHandlerService.handleError(err);
      },
    });
  }
  setValuesInLocalStorage(value: ApiResponse) {
    this.tokenService.setTokens(value.object.token, value.object.refreshToken);
    this.tokenService.setCustomerNameGroupId(
      value.object.customerGroupId,
      value.object.fullName
    );
    this.tokenService.setCustomerId(value.object.customerId);
  }
  navigateUserBasedOnRoles(value: ApiResponse) {
    if (value.object.customerGroupId == constants.CUSTOMER_GROUP_ID) {
      // Navigate to the customer dashboard
      this.router.navigate(['/customer-dashboard']).then((res) => {
        this._isLoading = false;
        this._cd.detectChanges(); // force Angular to update the view
        this.dataService.setLoginStatus(true);
      });
    } else if (value.object.customerGroupId == constants.ADMIN_GROUP_ID) {
      // Navigate to the admin dashboard
      this.router.navigate(['/admin-dashboard']).then((res) => {
        this._isLoading = false;
        this._cd.detectChanges(); // force Angular to update the view
        this.dataService.setLoginStatus(true);
      });
    } else {
      this.tokenService.removeTokens();
    }
  }
  get passwordErrors(): ErrorsValidation {
    return this._passwordErrors;
  }

  get userNameErrors(): ErrorsValidation {
    return this._userNameErrors;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
}
