import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../helper";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }
  public registerCustomer(user: any){
    return this.http.post(`${this.apiServerUrl}/user`, user);
  }
}
