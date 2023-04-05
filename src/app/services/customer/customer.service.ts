import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../env/environment";
import {RegistrationFormData} from "../../models/registration-form-data";
import {ApiResponse} from "../../models/api-response";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {
  }

  registerUser(user: RegistrationFormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/public/users/registration`, user);
  }

  getCustomerList(page: number, size: number, search: string, orderby: string, orderdir: string): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('search', search)
      .set('orderby', orderby)
      .set('orderdir', orderdir);
    return this.http.get<ApiResponse>(`${environment.apiBaseUrl}/customer/get-list`, { params });
  }
  viewCustomerById(customerId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.apiBaseUrl}/customer/details/id/${customerId}`);
  }
  updateCustomerDetail(customerId: number): any {
    return null;
    // return this.http.put<ApiResponse>(`${environment.apiBaseUrl}/customer/update/id/${customerId}`);
  }



}