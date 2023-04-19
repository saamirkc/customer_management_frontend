import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit{
  constructor() {}
  ngOnInit(): void {
  }
}
