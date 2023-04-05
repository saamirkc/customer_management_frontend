import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login/login.service";
import {DataService} from "../../services/data.service";
import {TokenService} from "../../services/token/token.service";
import {CustomerService} from "../../services/customer/customer.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  _isLoggedIn: boolean = false;
  _userName? : string | null;
  _isAdminDashboard: boolean = false;
  constructor(private tokenService: TokenService, private customerService: CustomerService, private dataService: DataService, private loginService: LoginService) {}
  ngOnInit(): void {
    if(this.tokenService.hasToken()){
      this._isLoggedIn = true;
      this.tokenService.getGroupId()
      this._userName = this.tokenService.getFullName();
    } else{
      this._isLoggedIn = false;
    }
    console.log("The user is logged in??", this._isLoggedIn)
    this.dataService.getIsAdminDashboard().subscribe(value => {
      this._isLoggedIn = value;
      this._userName = this.tokenService.getFullName();
    })
  }
  logOut(){
    console.log("logout is triggered")
    this._isLoggedIn = false;
    this.tokenService.removeTokens();
  }

}
