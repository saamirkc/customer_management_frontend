import { NgModule } from '@angular/core';
import {SignupRoutingModule} from "./signup-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SignupComponent} from "./signup.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    SignupRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SignupModule {
}
