import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import constants from "../../shared/constants";
import {Router} from "@angular/router";
import Constants from "../../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  constructor(private router: Router) {
  }

  public setTokens(jwtToken: string, refreshToken: string): void {
    // const encryptedJwtToken = this.encrypt(jwtToken);
    // const encryptedRefreshToken = this.encrypt(refreshToken);
    localStorage.setItem(constants.JWT_TOKEN_KEY, jwtToken);
    localStorage.setItem(constants.REFRESH_TOKEN_KEY, refreshToken);
  }

  public setCustomerNameGroupId(groupId: number, fullName: string): void {
    localStorage.setItem(constants.GROUP_ID, groupId.toString());
    localStorage.setItem(constants.FULL_NAME, fullName);
  }

  public setCustomerId(customerId: number){
    localStorage.setItem(Constants.CUSTOMER_ID, customerId.toString());
  }

  public getCustomerId(){
    return localStorage.getItem(Constants.CUSTOMER_ID);
  }

  public getGroupId() {
     return localStorage.getItem(constants.GROUP_ID);
  }
  public getFullName(){
    return localStorage.getItem(constants.FULL_NAME);
  }
  public getJwtToken(): string {
    const encryptedJwtToken = localStorage.getItem(constants.JWT_TOKEN_KEY);
    console.log('ENCRYPTED TOKEN', encryptedJwtToken);
    if (encryptedJwtToken) {
      return encryptedJwtToken;
      // return this.decrypt(encryptedJwtToken);
    }
    return '';
  }

  hasToken(): boolean {
    return !!this.getJwtToken();
  }

  public getRefreshToken(): string {
    const encryptedRefreshToken = localStorage.getItem(constants.REFRESH_TOKEN_KEY);
    if (encryptedRefreshToken) {
      return encryptedRefreshToken;
      // return this.decrypt(encryptedRefreshToken);
    }
    return '';
  }

  isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    return decodedToken && decodedToken.exp < Date.now() / 1000;
  }

  private decodeToken(token: string): any {
    if (!token) {
      return null;
    }
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  public removeTokens(): void {
    localStorage.removeItem(constants.JWT_TOKEN_KEY);
    localStorage.removeItem(constants.REFRESH_TOKEN_KEY);
    this.router.navigate(['/login'])
  }

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, constants.SECRET_KEY).toString();
  }

  private decrypt(value: string): string {
    return CryptoJS.AES.decrypt(value, constants.SECRET_KEY).toString();
  }

}
