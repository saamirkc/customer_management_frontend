import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "../../services/customer/customer.service";
import Constants from "../../shared/constants";
import Swal from "sweetalert2";
import constants from "../../shared/constants";
import {StatusType} from "../../enums/status-type";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  private _verificationCode: string = '';

  ngOnInit(): void {
  }

  constructor(private _router: Router, private activatedRoute: ActivatedRoute, private customerService: CustomerService) {
  }
  setVerificationCode(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this._verificationCode = value;
  }
  verifyUser() {
    let customerId = this.activatedRoute.snapshot.queryParamMap.get('customerId')
    this.customerService
      .verifyCustomer(this._verificationCode, customerId).subscribe({
      next: value => {
        if (value.status === Constants.STATUS_SUCCESS && JSON.parse(value.object).status == StatusType.ACTIVE ) {
          Swal.fire({
            title: value.message,
            icon: 'success',
            timer: 4000
          }).then(res => {
            this._router.navigate(['/login'])
          });
        }
      }, error: err => {
        console.error(err)
        if (err.error.details.length != 0) {
          Swal.fire({
            title: err.error.details[0],
            icon: 'error',
            timer: 3000
          }).then(r => {
            this._router.navigate(['/login'])
          });
        } else {
          Swal.fire({
            title: err.error.message,
            icon: 'error',
            timer: 3000
          });
        }
      },
    })
  }
}
