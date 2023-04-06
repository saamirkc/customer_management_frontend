import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CustomerDetails} from "../models/customer-details";
import {LoginService} from "./login/login.service";
import {CustomerService} from "./customer/customer.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private loginStatusSubject = new Subject<boolean>()
  private _customerDetailSubject =new BehaviorSubject <CustomerDetails>({customerFamilyList: [], maritalStatus: false, status: "", userName: ""});
  constructor(private customerService: CustomerService) { }
  getIsAdminDashboard(): Subject<boolean> {
    return this.loginStatusSubject;
  }
  setIsAdminDashboard(value: boolean) {
    this.loginStatusSubject.next(value);
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
