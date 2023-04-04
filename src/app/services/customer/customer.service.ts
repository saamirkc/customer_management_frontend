import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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

  public registerUser(user: RegistrationFormData): Observable<ApiResponse> {
    {
      return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/public/users/registration`, user);
    }
  }
}
