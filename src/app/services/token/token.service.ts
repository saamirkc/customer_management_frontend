import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import constants from "../../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  constructor() {
  }

  public setTokens(jwtToken: string, refreshToken: string): void {
    const encryptedJwtToken = this.encrypt(jwtToken);
    const encryptedRefreshToken = this.encrypt(refreshToken);
    localStorage.setItem(constants.JWT_TOKEN_KEY, encryptedJwtToken);
    localStorage.setItem(constants.REFRESH_TOKEN_KEY, encryptedRefreshToken);
  }

  public setCustomerGroupId(groupId: number): void {
    localStorage.setItem(constants.GROUP_ID, groupId.toString());
  }

  public getGroupId(): string | null {
     return localStorage.getItem(constants.GROUP_ID);
  }

  public getJwtToken(): string | null {
    const encryptedJwtToken = localStorage.getItem(constants.JWT_TOKEN_KEY);
    if (encryptedJwtToken) {
      const decryptedJwtToken = this.decrypt(encryptedJwtToken);
      return decryptedJwtToken.toString();
    }
    return null;
  }

  hasToken(): boolean {
    return !!this.getJwtToken();
  }

  public getRefreshToken(): string {
    const encryptedRefreshToken = localStorage.getItem(constants.REFRESH_TOKEN_KEY);
    if (encryptedRefreshToken) {
      const decryptedRefreshToken = this.decrypt(encryptedRefreshToken);
      return decryptedRefreshToken.toString();
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
  }

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, constants.SECRET_KEY).toString();
  }

  private decrypt(value: string): any {
    return CryptoJS.AES.decrypt(value, constants.SECRET_KEY);
  }

}
