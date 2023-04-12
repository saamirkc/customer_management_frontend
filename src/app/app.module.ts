import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { HomeComponent } from './pages/home/home.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {authInterceptProviders} from "./services/auth.interceptor";
import { CustomerDashboardComponent } from './pages/customer/customer-dashboard/customer-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import { SidebarComponent } from './pages/admin/sidebar/sidebar.component';
import { WelcomeComponent } from './pages/admin/welcome/welcome.component';
import {MatTableModule} from "@angular/material/table";
import { ViewCustomerDetailsComponent } from './pages/admin/view-customer-details/view-customer-details.component';
import { AddCustomerDetailsComponent } from './pages/admin/add-customer-details/add-customer-details.component';
import {MatLineModule} from "@angular/material/core";
import {AdminDashboardComponent} from "./pages/admin/dashboard/admin-dashboard.component";
import {CustomerViewPopupComponent} from "./pages/customer/customer-view-popup/customer-view-popup.component";
import { DeleteModalComponentComponent } from './pages/admin/delete-modal-component/delete-modal-component.component';
import { VerificationComponent } from './pages/verification/verification.component';
import {MatSelectModule} from "@angular/material/select";
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    // SignupComponent,
    LoginComponent,
    HomeComponent,
    AdminDashboardComponent,
    CustomerDashboardComponent,
    ProfileComponent,
    SidebarComponent,
    WelcomeComponent,
    ViewCustomerDetailsComponent,
    AddCustomerDetailsComponent,
    CustomerViewPopupComponent,
    CustomerViewPopupComponent,
    DeleteModalComponentComponent,
    VerificationComponent,
    PageNotFoundComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatListModule,
        NgbModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatCardModule,
        MatTableModule,
        HttpClientModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatIconModule,
        MatLineModule,
        ReactiveFormsModule,
        MatSelectModule,
    ],
  providers: [authInterceptProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
