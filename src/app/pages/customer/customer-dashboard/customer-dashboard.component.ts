import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit{
  constructor(private dataService: DataService) {
  }
  ngOnInit(): void {
    console.log("ng onit is called in the customer component")
    this.dataService.setIsAdminDashboard(false);
  }
}
