import { NgModule } from '@angular/core';

import {RouterModule, Routes} from "@angular/router";
import {AdminDashboardComponent} from "./admin-dashboard.component";
import {WelcomeComponent} from "../welcome/welcome.component";
import {ProfileComponent} from "../../profile/profile.component";
import {ViewCustomerDetailsComponent} from "../view-customer-details/view-customer-details.component";

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: '',
        component: WelcomeComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'customer-details',
        component: ViewCustomerDetailsComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardModule { }
