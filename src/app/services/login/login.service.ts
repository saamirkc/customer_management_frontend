import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../env/environment";
import { Router} from "@angular/router";
import {LoginData} from "../../models/login-data";
import {ApiResponse} from "../../models/api-response";
import {Observable} from "rxjs";
import {TokenData} from "../../models/token-data";
import constants from "../../shared/constants";
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router) {
  }
  // generate the token.
  public login(loginData: LoginData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/public/login`, loginData);
  }

  public getTokensAfterJwtExpiry(refreshTokenData: TokenData): Observable<ApiResponse> {
     let apiResponseObservable = this.http.post<ApiResponse>(`${environment.apiBaseUrl}/refreshtokens/get-tokens`, refreshTokenData);

     apiResponseObservable.subscribe({
       next: value => {
          console.log("API Response observable", value)
       }, error: err => {
         console.log(err);
       },
       complete: () => console.log('Observable Subscription completed')
     });
     return apiResponseObservable;
  }

  isLoggedIn() {
    let tokenStr = localStorage.getItem(constants.JWT_TOKEN_KEY);
    return !(tokenStr == undefined || tokenStr == '' || tokenStr == null);
  }
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login'])
    return true;
  }
  getToken() {
    return localStorage.getItem('token');
  }
  setUser(user: LoginData) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  getUser() {
    let userDetails = localStorage.getItem("user");
    if (userDetails != null) {
      return JSON.parse(userDetails);
    } else {
      this.logOut();
      return null;
    }
  }
  getUserRole() {
    let userDetails = this.getUser();
    return userDetails.authorities[0].authority;
  }
  // get the current user
  getCurrentUser():any {
    // return this.http.get(`${environment.apiBaseUrl}/current-user`);
    return {
      userId: 'SKC012',
      userName: 'sagar.kc@f1soft.com',
      phoneNumber: '9816190656',
      password: 'kc_sagar',
      status: 'ACTIVE',
      authorities: [{
        authority: "ADMIN"
      }]
    }
  }
}
