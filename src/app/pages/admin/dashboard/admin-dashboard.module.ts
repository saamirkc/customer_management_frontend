import { NgModule } from '@angular/core';

import {RouterModule, Routes} from "@angular/router";
import {AdminDashboardComponent} from "./admin-dashboard.component";
import {WelcomeComponent} from "../welcome/welcome.component";
import {ProfileComponent} from "../../profile/profile.component";
import {ViewCustomerDetailsComponent} from "../view-customer-details/view-customer-details.component";
import {AddCustomerDetailsComponent} from "../add-customer-details/add-customer-details.component";
import {UniqueItemsPipe} from "../../../shared/unique-items.pipe";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
        path: 'add-customer',
        component: AddCustomerDetailsComponent
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
  declarations:[UniqueItemsPipe],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, UniqueItemsPipe]
})
export class AdminDashboardModule { }
