import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {CustomerService} from "./customer/customer.service";
import CustomerListResponse from "../models/customer-list-response";
import {StatusType} from "../enums/status-type";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private loginStatusSubject = new Subject<boolean>;
  private userNameSubject = new BehaviorSubject<string>('')
  private _customerIdSubject = new Subject<number>();

  private _customerDetailSubject = new BehaviorSubject<CustomerListResponse>({createdBy: 0, createdTs: "",
    emailAddress: "", id: 0, modifiedTs: "",
    address: "",
    mobileNumber: "",
    status: StatusType.ACTIVE, userName: ""
  });

  constructor(private customerService: CustomerService) {
  }

  getLoginStatus(): Subject<boolean> {
    return this.loginStatusSubject;
  }

  setLoginStatus(value: boolean) {
    this.loginStatusSubject.next(value);
  }

  setUserName(value: string) {
    this.userNameSubject.next(value);
  }

  getUserName(): Observable<string> {
    return this.userNameSubject.asObservable();
  }

  getCustomerIdSubject(): Subject<number> {
    return this._customerIdSubject;
  }

  setCustomerIdSubject(value: number) {
    this._customerIdSubject.next(value);
  }
  getCustomerDetailSubject(): Observable<CustomerListResponse> {
    return this._customerDetailSubject.asObservable();
  }
  setCustomerDetailSubject(customerData: CustomerListResponse) {
    this._customerDetailSubject.next(customerData);
  }
}
