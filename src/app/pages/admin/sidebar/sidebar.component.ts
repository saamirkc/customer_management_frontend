import { Component } from '@angular/core';
import {TokenService} from "../../../services/token/token.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent  {
  constructor(private tokenService: TokenService) {
  }
  logOut(){
    this.tokenService.removeTokens();
  }
}
