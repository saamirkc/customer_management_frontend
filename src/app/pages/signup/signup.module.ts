import { NgModule } from '@angular/core';
import {SignupRoutingModule} from "./signup-routing.module";
import {SpinnerComponent} from "../../components/spinner/spinner.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SignupComponent} from "./signup.component";
import {CommonModule} from "@angular/common";
@NgModule({
  declarations: [
    SpinnerComponent,
    SignupComponent
  ],
  imports: [
    SignupRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class SignupModule {
}
