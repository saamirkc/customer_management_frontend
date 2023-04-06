import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, switchMap, take} from "rxjs";
import {Injectable} from "@angular/core";
import {LoginService} from "./login/login.service";
import {TokenData} from "../models/token-data";
import {TokenService} from "./token/token.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService, private tokenService: TokenService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getJwtToken();

    console.log("ACCESS TOKEN", accessToken);

    if (accessToken && this.tokenService.isTokenExpired(accessToken)) {
      // Access token has expired, use refresh token to get new tokens
      this.router.navigate(['login'])
      return next.handle(request);
      const refreshToken = this.tokenService.getRefreshToken();
      const tokenData: TokenData = {
        token: accessToken,
        refreshToken: refreshToken
      };
      return this.loginService.getTokensAfterJwtExpiry(tokenData).pipe(
        take(1),
        switchMap((response) => {
          // New tokens obtained, add access token to headers and retry the request
          console.log("REUQST HEADER1", response);

          // const newAccessToken = response.object.token;
          // const newRefreshToken = response.object.refreshToken;
          // console.log("REUQST HEADER2", newAccessToken);
          // console.log("REUQST HEADER3", newRefreshToken);
          //
          // this.tokenService.setTokens(newAccessToken,newRefreshToken)
          // const authRequest = request.clone({
          //   headers: request.headers.set('Authorization', `Bearer ${newAccessToken}`)
          // });
          // console.log("REUQST HEADER1.1", request.headers.get('Authorization'));

          return next.handle(request);
        })
      );
    } else if (accessToken) {
      // Access token is valid, add it to the headers and proceed with the request
      request = this.addToken(request, accessToken);
      return next.handle(request);
    } else {
      // No token available, proceed with the request
      this.router.navigate(['login'])
      return next.handle(request);
    }
  }
  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authInterceptProviders = [{
  provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
}]
