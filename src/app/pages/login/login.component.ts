import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";

export interface LoginData {
  userName: string;
  password: string;
  authorities: string[]
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData: LoginData = {
    userName: '',
    password: '',
    authorities: ['']
  }
  constructor(private _snackBar: MatSnackBar,private loginService: LoginService, private router: Router, private dataService: DataService) {}
  ngOnInit(): void {}
  formSubmit() {
    if (this.loginData.userName.trim() === '' || this.loginData.userName === null) {
      this._snackBar.open('Username is required', '', {
        duration: 2000
      });
      return;
    }
    this.loginService.generateToken(this.loginData).subscribe(
      {
        next: value => {
          console.log(this.loginService.getToken());
          // login
          this.loginService.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o');
          // get the current user
          this.loginService.setUser(this.loginService.getCurrentUser());
          // this.loginService.getCurrentUser().subscribe({
          //   next:(value: LoginData) =>{
          //     this.loginService.setUser(value);
          //     // redirection based on the user roles.
          //   }
          // })
        },
        error: err => {
          this.loginService.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzNDU2Nzg5LCJuYW1lIjoiSm9zZXBoIn0.OpOSSw7e485LOP5PrzScxHb7SR6sAOMRckfFwi4rp7o');
          // get the current user
          this.loginService.setUser(this.loginService.getCurrentUser());
          // redirection based on the user roles.
          console.log("Error is thrown here", err);
          if(this.loginService.getUserRole() === "ADMIN"){
            this.router.navigate(['/admin-dashboard']).then(res=>{
              this.dataService.setIsAdminDashboard(true);
            });

          } else {
            this.loginService.logOut();
          }
        },
        complete: () => console.log('Observable Subscription completed')
      }
    )
  }
}
