import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login/login.service";
import {BehaviorSubject, interval, map, Observable, ReplaySubject, take} from "rxjs";
import {TokenService} from "../../services/token/token.service";
import {CustomerService} from "../../services/customer/customer.service";
import {DataService} from "../../services/data.service";
import {CustomerDetails} from "../../models/customer-details";
import Swal from "sweetalert2";
import Constants from "../../shared/constants";

export interface PeriodicElement {
  column: string;
  data: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {column: "Username", data: "Saagar KC"},
  {column: "Userid", data: "SKC123"},
  {column: "Phone", data: "9816190656"},
  {column: "Role", data: "ADMIN"},
  {column: "Status", data: "Active"},
];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private _customerDetail: CustomerDetails;
  private _customerId?: string | null;

  constructor(private loginService: LoginService, private tokenService: TokenService, private customerService: CustomerService, private dataService: DataService,) {
    this._customerDetail = {customerFamilyList: [], maritalStatus: false, status: "", userName: ""};
  }

  ngOnInit(): void {
    this._customerId = this.tokenService.getCustomerId()
    if (this._customerId) {
      this.customerService.viewCustomerById(Number(this._customerId)).subscribe({
        next: value => {
          console.log("View customer by id is called")
          this._customerDetail = value.object;
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

  get customerDetail(): CustomerDetails {
    return this._customerDetail;
  }

  get user(): any {
    return null;
  }
}
