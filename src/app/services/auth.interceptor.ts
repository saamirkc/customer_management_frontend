import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {Injectable} from "@angular/core";
import {LoginService} from "./login/login.service";
import {TokenData} from "../models/token-data";
import {TokenService} from "./token/token.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private loginService: LoginService, private tokenService:TokenService, private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getJwtToken();
    if (accessToken && this.tokenService.isTokenExpired(accessToken)) {
      // Access token has expired, use refresh token to get new tokens
      const refreshToken = this.tokenService.getRefreshToken();
      const tokenData: TokenData = {
        token: accessToken,
        refreshToken: refreshToken
      };
      return this.loginService.getTokensAfterJwtExpiry(tokenData).pipe(
        switchMap((response) => {
          // New tokens obtained, add access token to headers and retry the request
          const newAccessToken = response.object.token;
          const newRefreshToken = response.object.refreshToken;
          this.tokenService.setTokens(newAccessToken,newRefreshToken)
          const authRequest = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${newAccessToken}`)
          });
          return next.handle(authRequest);
        })
      );
    } else if (accessToken) {
      // Access token is valid, add it to the headers and proceed with the request
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(authRequest);
    } else {
      // No token available, proceed with the request
      this.router.navigate(['login'])
      return next.handle(request);
    }
  }
}
export const authInterceptProviders = [{
  provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
}]
