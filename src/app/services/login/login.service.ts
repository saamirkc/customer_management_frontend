import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../env/environment";
import {Router} from "@angular/router";
import {LoginData} from "../../models/login-data";
import {ApiResponse} from "../../models/api-response";
import {map, Observable, timeout} from "rxjs";
import {TokenData} from "../../models/token-data";
import constants from "../../shared/constants";
import {TokenService} from "../token/token.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {
  }

  // generate the token.
  public login(loginData: LoginData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/public/login`, loginData).pipe(
      timeout(10000)
    );
  }

  public getTokensAfterJwtExpiry(refreshTokenData: TokenData): Observable<any> {
    return this.http.post<ApiResponse>(`${environment.apiBaseUrl}/refresh-tokens/get-tokens`, refreshTokenData)
      .pipe(
        map((data) => {
          if (data.status == 'SUCCESS') {
            this.tokenService.setTokens(data.object.token, data.object.refreshToken);
          }
          return data;
        })
      );
  }

  isLoggedIn() {
    let tokenStr = localStorage.getItem(constants.JWT_TOKEN_KEY);
    return !(tokenStr == undefined || tokenStr == '' || tokenStr == null);
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
