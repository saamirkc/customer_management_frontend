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
    const decryptedAccessToken = this.tokenService.getJwtToken(true);
    const encryptedAccessToken = this.tokenService.getJwtToken(false);

    console.log('DECRYPTED TOKEN', decryptedAccessToken);
    console.log('ENCRYPTED TOKEN', encryptedAccessToken);

    if (decryptedAccessToken && this.tokenService.isTokenExpired(decryptedAccessToken)) {
      const refreshToken = this.tokenService.getRefreshToken();
      if (refreshToken) {
        const tokenData: TokenData = {
          token: decryptedAccessToken,
          refreshToken: refreshToken
        };
        return this.loginService.getTokensAfterJwtExpiry(tokenData).pipe(
          take(1),
          switchMap((response) => {
            // New tokens obtained, add access token to headers and retry the request
            const newAccessToken = response.object.token;
            const newRefreshToken = response.object.refreshToken;
            this.tokenService.setTokens(newAccessToken,newRefreshToken)
            request = this.addToken(request, newAccessToken);
            return next.handle(request);
          })
        );
      }
      this.router.navigate(['login'])
      return next.handle(request);
    } else if (decryptedAccessToken && !this.tokenService.isTokenExpired(decryptedAccessToken)) {
      // Access token is valid, add it to the headers and proceed with the request
      console.log("The decrypted token is ,", decryptedAccessToken)
      request = this.addToken(request, decryptedAccessToken);
      return next.handle(request);
    } else {
      // No token available, proceed with the request
      // this.router.navigate(['login'])
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
