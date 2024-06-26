import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login/login.service";
import {DataService} from "../../services/shared/data.service";
import {TokenService} from "../../services/token/token.service";
import {CustomerService} from "../../services/customer/customer.service";
import {ErrorhandlerService} from "../../services/errorhandler/errorhandler.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  _isLoggedIn: boolean = true;
  _userName?: string | null;
  _isAdminDashboard: boolean = false;

  constructor(private tokenService: TokenService, private errorhandlerService : ErrorhandlerService, private customerService: CustomerService, private dataService: DataService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.subscribeLoginStatus();
    if (this.tokenService.hasToken(true)) {
      this._isLoggedIn = true;
      this._userName = this.tokenService.getFullName();
    } else {
      this._isLoggedIn = false;
    }
  }

  logOut() {
    this._isLoggedIn = false;
    this.tokenService.removeTokens();
  }
  subscribeLoginStatus() {
    this.dataService.getLoginStatus().subscribe({
      next: value => {
        this._isLoggedIn = value;
        this._userName = this.tokenService.getFullName();
      }, error: err => {
        this.errorhandlerService.handleError(err)
      }
    })
  }

}
