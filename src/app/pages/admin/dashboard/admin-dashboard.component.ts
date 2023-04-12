import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
  }
}
