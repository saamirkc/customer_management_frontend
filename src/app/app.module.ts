import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignupComponent } from './pages/signup/signup.component';
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
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import { SidebarComponent } from './pages/admin/sidebar/sidebar.component';
import { WelcomeComponent } from './pages/admin/welcome/welcome.component';
import {MatTableModule} from "@angular/material/table";
import { ViewCategoriesComponent } from './pages/admin/view-categories/view-categories.component';
import { AddCategoriesComponent } from './pages/admin/add-categories/add-categories.component';
import {MatLineModule} from "@angular/material/core";
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    UserDashboardComponent,
    ProfileComponent,
    SidebarComponent,
    WelcomeComponent,
    ViewCategoriesComponent,
    AddCategoriesComponent,
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
    ReactiveFormsModule
  ],
  providers: [authInterceptProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
