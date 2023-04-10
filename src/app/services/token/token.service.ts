import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import constants from "../../shared/constants";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  constructor(private router: Router) {
  }

  public setTokens(jwtToken: string, refreshToken: string): void {
    const encryptedJwtToken = this.encrypt(jwtToken);
    const encryptedRefreshToken = this.encrypt(refreshToken);
    localStorage.setItem(constants.JWT_TOKEN_KEY, encryptedJwtToken);
    localStorage.setItem(constants.REFRESH_TOKEN_KEY, encryptedRefreshToken);
  }

  public setCustomerNameGroupId(groupId: number, fullName: string): void {
    localStorage.setItem(constants.GROUP_ID, groupId.toString());
    localStorage.setItem(constants.FULL_NAME, fullName);
  }

  public setCustomerId(customerId: number) {
    localStorage.setItem(constants.CUSTOMER_ID, customerId.toString());
  }

  public getCustomerId() {
    return localStorage.getItem(constants.CUSTOMER_ID);
  }

  public getGroupId() {
    return localStorage.getItem(constants.GROUP_ID);
  }

  public getFullName() {
    return localStorage.getItem(constants.FULL_NAME);
  }

  public getJwtToken(needDecryptedToken: boolean): string {
    if (needDecryptedToken) {
      const encryptedJwtToken = localStorage.getItem(constants.JWT_TOKEN_KEY);
      if (encryptedJwtToken) {
        // return encryptedJwtToken;
        return this.decrypt(encryptedJwtToken);
      }
    } else {
      const accessToken = localStorage.getItem(constants.JWT_TOKEN_KEY);
      if (accessToken) {
        return accessToken;
      }
    }
    return '';
  }

  hasToken(needDecrptedToken: boolean): boolean {
    return !!this.getJwtToken(needDecrptedToken);
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
    localStorage.clear();
    this.router.navigate(['/login'])
  }

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, constants.SECRET_KEY).toString();
  }

  private decrypt(value: string): string {
    const decryptedJwt = CryptoJS.AES.decrypt(value, constants.SECRET_KEY);
    try {
      const str = decryptedJwt.toString(CryptoJS.enc.Utf8);
      if (str.length > 0) {
        return str;
      } else {
        return '';
      }
    } catch (e) {
      return '';
    }
  }
}
