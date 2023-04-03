import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {LoginService} from "./login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private loginService: LoginService) {}
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getToken();
    console.log("inside intercept");
    if(token !=null){
      console.log("inside method");
      return next.handle(httpRequest.clone({
        setHeaders: { Authorization : `Bearer ${token}`}
      }));
    }
    return next.handle(httpRequest);

  }
}
export const authInterceptProviders = [{
  provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
}]
