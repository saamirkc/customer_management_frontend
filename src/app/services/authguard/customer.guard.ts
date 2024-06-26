import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TokenService} from "../token/token.service";
import constants from "../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.tokenService.hasToken(true) && this.tokenService.getGroupId() == constants.CUSTOMER_GROUP_ID.toString()){
      return true;
    }
    this.router.navigate(['/login'])
    return false;
  }
}
