import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer/customer.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../shared/common.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  private readonly _registrationForm: FormGroup;

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

  onUserInputChange(): void {
    this.userNameFlag = this.user.username === '';
  }
  constructor(private formBuilder: FormBuilder, private userService: CustomerService, private _snackBar: MatSnackBar, private commonService: CommonService) {
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
    console.log(this.user);
    this.userService.registerCustomer(this._registrationForm).subscribe({
        next: value => {
          console.log(value);
          this._snackBar.open('Success', 'Cancel', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        },
        error: error => {
          console.error(error)
          this._snackBar.open("Error", 'Ok', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        },
        complete: () => console.log('Complete')
      }
    )
  }
  ngOnInit(): void {

  }
}
