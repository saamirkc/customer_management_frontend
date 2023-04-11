import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginService} from "../../services/login/login.service";
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../shared/common.service";
import {TokenService} from "../../services/token/token.service";
import Swal from "sweetalert2";
import constants from "../../shared/constants";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private readonly _loginForm: FormGroup;

  get loginForm(): FormGroup {
    return this._loginForm;
  }

  constructor(private formBuilder: FormBuilder, private commonService: CommonService,
              private _snackBar: MatSnackBar, private loginService: LoginService, private router: Router,
              private dataService: DataService, private tokenService: TokenService) {
    this._loginForm = this.formBuilder.group({
      userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      loginType: ['']
    })
  }

  ngOnInit(): void {
  }

  formSubmit() {
    if (this._loginForm.invalid) {
      return;
    }
    const formData = this._loginForm.value; // extract form data
    this.loginService.login(formData).subscribe(
      {
        next: value => {
          Swal.fire({
            title: value.message,
            icon: 'success',
            timer: 4000
          }).then(res => this._loginForm.reset());
          this.tokenService.setTokens(value.object.token, value.object.refreshToken);
          this.tokenService.setCustomerNameGroupId(value.object.customerGroupId, value.object.fullName);
          this.tokenService.setCustomerId(value.object.customerId);
          // redirection based on the user roles.
          if (value.object.customerGroupId == constants.CUSTOMER_GROUP_ID) {
            // Navigate to the customer dashboard
            this.router.navigate(['/customer-dashboard']).then(r => {})
          } else if (value.object.customerGroupId == constants.ADMIN_GROUP_ID) {
            // Navigate to the customer dashboard
            this.router.navigate(['/admin-dashboard']).then(res => {
              this.dataService.setIsAdminDashboard(true);
              // this.dataService.setCustomerDetailSubject(value.object.customerId)
            });
          } else {
            this.tokenService.removeTokens();
          }
        },
        error: err => {
          console.error(err)
          if (err.error.details.length != 0) {
            Swal.fire({
              title: err.error.details[0],
              icon: 'error',
              timer: 3000
            });
          } else {
            Swal.fire({
              title: err.error.message,
              icon: 'error',
              timer: 3000
            });
          }
        },
        complete: () => console.log('Observable Subscription completed')
      }
    )
  }
}
