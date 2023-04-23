import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CustomerDetails} from "../models/customer-details";
import {LoginService} from "./login/login.service";
import {CustomerService} from "./customer/customer.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private loginStatusSubject = new Subject<boolean>;
  private userNameSubject = new BehaviorSubject<string>('')
  private _customerIdSubject = new Subject<number>();

  private _customerDetailSubject = new BehaviorSubject<CustomerDetails>({
    address: "", citizenNumber: "", dateOfBirth: "", firstName: "", gender: "", lastName: "", mobileNumber: "",
    customerFamilyList: [],
    maritalStatus: false,
    status: "",
    userName: ""
  });

  constructor(private customerService: CustomerService) {
  }

  getLoginStatus(): Subject<boolean> {
    console.log("get is admin dashboard is invoked")
    return this.loginStatusSubject;
  }

  setLoginStatus(value: boolean) {
    console.log("set admin dashboard is invoked", value)
    this.loginStatusSubject.next(value);
  }

  setUserName(value: string) {
    console.log("set username is invoked", value)
    this.userNameSubject.next(value);
  }

  getUserName(): Observable<string> {
    console.log("get username is invoked", this.userNameSubject)
    return this.userNameSubject.asObservable();
  }

  getCustomerIdSubject(): Subject<number> {
    return this._customerIdSubject;
  }

  setCustomerIdSubject(value: number) {
    console.log("setter customer id is invoked", value)
    this._customerIdSubject.next(value);
  }
  getCustomerDetailSubject(): BehaviorSubject<CustomerDetails> {
    return this._customerDetailSubject;
  }

  setCustomerDetailSubject(customerId: number) {
    this.customerService.viewCustomerById(customerId).subscribe({
      next: value => {
        console.log("View customer by id is called")
        this._customerDetailSubject.next(value.object);
      }, error: err => {
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
      }
    })
  }
}
