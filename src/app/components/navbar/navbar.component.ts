import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login/login.service";
import {DataService} from "../../services/data.service";
import {TokenService} from "../../services/token/token.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  isLoggedIn: boolean = false;
  userName : string = '';
  isAdminDashboard: boolean = false;
  constructor(private tokenService: TokenService, private dataService: DataService, private loginService: LoginService) {}
  ngOnInit(): void {
    if(this.tokenService.hasToken()){
      this.isLoggedIn = true;
      this.userName = this.loginService.getUser().userName;
    } else{
      this.isLoggedIn = false;
    }
    console.log("The user is logged in??", this.isLoggedIn)
    this.dataService.getIsAdminDashboard().subscribe(value => {
      this.isLoggedIn = value;
      this.userName = this.loginService.getUser().userName;
    })
  }
  logOut(){
    console.log("logout is triggered")
    this.isLoggedIn = false;
    this.tokenService.removeTokens();
  }

}
