import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../env/environment";
import {RegistrationFormData} from "../../models/registration-form-data";
import {ApiResponse} from "../../models/api-response";
import {catchError, map, Observable, throwError, timeout} from "rxjs";
import {CustomerDetails} from "../../models/customer-details";
import {StatusType} from "../../enums/status-type";
import {StatusRequest} from "../../models/status-request";
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {
  }

  registerUser(user: RegistrationFormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/public/users/registration`, user).pipe(timeout(10000));
  }
  addCustomerDetails(customerDetails: CustomerDetails): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/customer/save`, customerDetails);
  }
  getCustomerList(page: number, size: number, status: string, search: string, orderby: string, orderdir: string): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status)
      .set('search', search)
      .set('orderby', orderby)
      .set('orderdir', orderdir);
    return this.http.get<ApiResponse>(`${environment.apiBaseUrl}/customer/get-list`, {params});
  }

  viewCustomerById(customerId: number): Observable<ApiResponse> {
    console.log("view customer by id is invoked", customerId)
    return this.http.get<ApiResponse>(`${environment.apiBaseUrl}/customer/details/id/${customerId}`);
  }

  updateCustomerDetail(customer: CustomerDetails, customerId: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.apiBaseUrl}/customer/update/id/${customerId}`, customer);
  }

  deleteCustomerById(customerId: number): Observable<ApiResponse> {
    const messageBody: StatusRequest = {
      customerId: customerId,
      status: StatusType.DELETED,
      message: ""
    };
    return this.http.put<ApiResponse>(`${environment.apiBaseUrl}/customer/update-status/id/${customerId}?status=${StatusType.DELETED}`, messageBody);
  }

  getProfileImage(customerId: number) {
    let getProfileImageUrl: string = `${environment.apiBaseUrl}/customer/view/own-profile-image/id/${customerId}`;
    let blobObservable = this.http.get<Blob>(getProfileImageUrl, {responseType: 'blob' as 'json'});
    blobObservable.pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
    return blobObservable;
  }

  uploadProfileImage(file: File, customerId: string | null | undefined): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    console.log("before hitting the upload api in the backend", file)
    return this.http.put<ApiResponse>(`${environment.apiBaseUrl}/customer/upload/profile-image/id/${customerId}`, formData).pipe(
      timeout(10000)
    )
  }

  verifyCustomer(verificationCode: string, customerId: string | null) {
    return this.http.post<any>(`${environment.apiBaseUrl}/public/users/verify/id/${customerId}?verificationCode=${verificationCode}`, {}).pipe(
      timeout(10000)
    )
  }
}
