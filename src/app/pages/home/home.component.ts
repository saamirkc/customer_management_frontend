import {Component, OnInit} from '@angular/core';
import {TokenService} from "../../services/token/token.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  constructor(private tokenService:TokenService, private dataService: DataService) {
  }
  ngOnInit(): void {
  }


}
