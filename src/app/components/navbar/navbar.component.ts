import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../services/login.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  isLoggedIn: boolean = false;
  userName : string = '';
  isAdminDashboard: boolean = false;
  constructor(private loginService: LoginService, private dataService: DataService) {}
  ngOnInit(): void {
    if(this.loginService.isLoggedIn()){
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
    this.loginService.logOut();
  }

}
