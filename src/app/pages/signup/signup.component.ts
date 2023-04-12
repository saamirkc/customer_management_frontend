import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer/customer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../shared/common.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {ErrorhandlerService} from "../../services/errorhandler/errorhandler.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  private readonly _registrationForm: FormGroup;

  private _isLoading = false;

  get registrationForm(): FormGroup {
    return this._registrationForm;
  }

  userNameFlag: boolean = true;
  user = {
    username: '',
    password: '',
    email: '',
    mobileNumber: '',
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  onUserInputChange(): void {
    this.userNameFlag = this.user.username === '';
  }

  constructor(private formBuilder: FormBuilder,private errorHandlerService:ErrorhandlerService, private _router: Router, private customerService: CustomerService,
              private commonService: CommonService,private dataService: DataService, private _cd: ChangeDetectorRef // add the ChangeDetectorRef
  ) {
    this._registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [Validators.required, this.commonService.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  formSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }
    const formData = this.registrationForm.value; // extract the form data
    this._isLoading = true;
    this.customerService.registerUser(formData).subscribe({
        next: value => {
          console.log(value);
          Swal.fire({
            title: value.message,
            icon: 'success',
            timer: 4000
          }).then(r =>
            this._registrationForm.reset());
          if (value.object.verificationCodeSent) {
            this.dataService.setUserName(formData.userName);
            this._router.navigate(
              ['/verification/', value.object.verificationLink],
              {
                queryParams: {
                  customerId: value.object.id,
                },
              }
            ).then(r => {
              this._isLoading = false;
              this._cd.detectChanges(); // force Angular to update the view
            });
          }
        },
        error: err => {
          this.errorHandlerService.handleError(err);
          this._isLoading = false; // hide the spinner
          this._cd.detectChanges(); // force Angular to update the view
        }
     }
    )
  }
  ngOnInit(): void {}
}
