import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../env/environment";
import {RegistrationFormData} from "../../models/registration-form-data";
import {ApiResponse} from "../../models/api-response";
import {catchError, map, Observable, throwError, timeout} from "rxjs";
import {CustomerDetails} from "../../models/customer-details";
import {StatusType} from "../../enums/status-type";
import {StatusRequest} from "../../models/status-request";
import {PagingData} from "../../models/paging-data";
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private pagingData?: PagingData;
  constructor(private http: HttpClient) {
  }

  registerUser(user: RegistrationFormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/public/users/registration`, user).pipe(timeout(10000));
  }
  addCustomerDetails(customerDetails: CustomerDetails): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/customer/save`, customerDetails);
  }
  getCustomerList(pageNo: number, sizeNo: number, status: string, search: string, orderBy: string, orderDir: string): Observable<ApiResponse> {
    this.pagingData = {page: pageNo, size: sizeNo, orderBy: orderBy, orderDir:orderDir}
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/customer/get-list?search=${search}&status=${status}`,this.pagingData);
  }

  viewCustomerById(customerId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.apiBaseUrl}/customer/details/id/${customerId}`);
  }

  updateCustomerDetail(customer: CustomerDetails, customerId: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.apiBaseUrl}/customer/update/id/${customerId}`, customer);
  }

  updateCustomerStatusById(customerId: number, status: StatusType): Observable<ApiResponse> {
    const messageBody: StatusRequest = {
      customerId: customerId,
      status: status,
      message: ""
    };
    return this.http.put<ApiResponse>(`${environment.apiBaseUrl}/customer/update-status/id/${customerId}?status=${status}`, messageBody);
  }

  getProfileImage(customerId: number) {
    let getProfileImageUrl: string = `${environment.apiBaseUrl}/customer/view/own-profile-image/id/${customerId}`;
    return this.http.get<Blob>(getProfileImageUrl, {responseType: 'blob' as 'json'});
  }

  uploadProfileImage(file: File, customerId: string | null | undefined): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
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
