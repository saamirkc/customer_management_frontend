import {Component, OnInit} from '@angular/core';
import {TokenService} from "./services/token/token.service";
import {DataService} from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'F1-Invest';

  constructor(private tokenService: TokenService, private dataService: DataService) {
  }
  ngOnInit(): void {
    this.clearLocalStorage();

  }
  clearLocalStorage() {
    if (!this.tokenService.hasToken(true)) {
      this.dataService.setIsAdminDashboard(false);
    }
  }

}
