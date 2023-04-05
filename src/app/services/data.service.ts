import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private loginStatusSubject = new Subject<boolean>()
  constructor() { }
  getIsAdminDashboard(): Subject<boolean> {
    return this.loginStatusSubject;
  }
  setIsAdminDashboard(value: boolean) {
    this.loginStatusSubject.next(value);
  }
}
