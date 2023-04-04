import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../../services/customer/customer.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../shared/common.service";
import Swal from "sweetalert2";
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
    const formData = this.registrationForm.value; // extract the form data
    this.userService.registerUser(formData).subscribe({
        next: value => {
          console.log(value);
          Swal.fire({
            title: value.message,
            icon: 'success',
            timer: 4000
          }).then(r => this._registrationForm.reset());
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
        complete: () => console.log('Complete')
      }
    )
  }
  ngOnInit(): void {

  }
}
