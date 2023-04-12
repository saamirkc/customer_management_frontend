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
    console.log("ng onit of app component is invoked")
  }

}
