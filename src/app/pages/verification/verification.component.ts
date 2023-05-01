import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer/customer.service';
import Constants from '../../services/shared/constants';
import { StatusType } from '../../enums/status-type';
import { ErrorhandlerService } from '../../services/errorhandler/errorhandler.service';
import { DataService } from '../../services/shared/data.service';
import { Subscription } from 'rxjs';
import { SuccessHandlerService } from '../../services/successhandler/success-handler.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
})
export class VerificationComponent implements OnInit, OnDestroy {
  private _verificationCode: string = '';
  private customerId?: string;
  private _userName: string = '';
  private userNameSubscription?: Subscription;
  constructor(
    private _router: Router,
    private dataService: DataService,
    private errorHandlerService: ErrorhandlerService,
    private successHandlerService: SuccessHandlerService,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}
  ngOnInit(): void {
    this.subscribeUserName();
  }
  subscribeUserName() {
    this.userNameSubscription = this.dataService.getUserName().subscribe({
      next: (value) => {
        this._userName = value;
      },
      error: (err) => {
        this.errorHandlerService.handleError(err);
      },
    });
  }
  verifyUser() {
    let customerId =
      this.activatedRoute.snapshot.queryParamMap.get('customerId');
    this.customerService
      .verifyCustomer(this._verificationCode, customerId)
      .subscribe({
        next: (value) => {
          if (
            value.status == Constants.STATUS_SUCCESS &&
            JSON.parse(value.object).status == StatusType.ACTIVE
          ) {
            this.successHandlerService.handleSuccessEvent(value.message);
            this._router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.errorHandlerService.handleError(err);
        },
      });
  }
  setVerificationCode(event: Event) {
    this._verificationCode = (event.target as HTMLInputElement).value;
  }
  get userName(): string {
    return this._userName;
  }

  ngOnDestroy(): void {
    if (this.userNameSubscription) {
      this.userNameSubscription.unsubscribe();
    }
  }
}
