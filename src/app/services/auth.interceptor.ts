import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {BehaviorSubject, catchError, EMPTY, filter, Observable, switchMap, take, tap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {LoginService} from "./login/login.service";
import {TokenData} from "../models/token-data";
import {TokenService} from "./token/token.service";
import {Router} from "@angular/router";
import {ErrorhandlerService} from "./errorhandler/errorhandler.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private loginService: LoginService,
              private tokenService: TokenService,
              private router: Router,
              private errorHandlerService: ErrorhandlerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const decryptedAccessToken = this.tokenService.getJwtToken(true);
    const decryptedRefreshToken = this.tokenService.getRefreshToken();

    if (decryptedAccessToken) {
      request = this.addToken(request, this.tokenService.getJwtToken(true));
    }
    const tokenData: TokenData = {
      token: decryptedAccessToken,
      refreshToken: decryptedRefreshToken
    };

    return next.handle(request).pipe(
      catchError((error) => {
        if (this.tokenService.isTokenExpired(decryptedAccessToken) && error instanceof HttpErrorResponse && error.status != 200) {
          return this.handleError(request, next, tokenData);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: String) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleError(request: HttpRequest<any>, next: HttpHandler, tokenData: TokenData) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.loginService.getTokensAfterJwtExpiry(tokenData).pipe(
        switchMap((token) => {
          this.isRefreshing = false;
          if (token.status == 'SUCCESS') {
            this.refreshTokenSubject.next(token.object.token);
            return next.handle(this.addToken(request, token.object.token));
          } else {
            this.loginService.logOut();
            return EMPTY;
          }
        }),
        catchError((error: any) => {
          this.isRefreshing = false;
          this.loginService.logOut();
          return throwError(error); // return an Observable with the error
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }
}

export const authInterceptProviders = [{
  provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
}]
