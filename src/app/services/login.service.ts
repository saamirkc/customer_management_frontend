import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginData} from "../pages/login/login.component";
import {environment} from "./helper";
import { Router} from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router) {
  }
  // generate the token.
  public generateToken(loginData: LoginData) {
    return this.http.post(`${environment.apiBaseUrl}/login`, loginData);
  }
  // logged in User: set the token in local storage.
  setToken(token: string) {
    localStorage.setItem('token', token);
    return true;
  }
  isLoggedIn() {
    let tokenStr = localStorage.getItem("token");
    return !(tokenStr == undefined || tokenStr == '' || tokenStr == null);
  }
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['login'])
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
