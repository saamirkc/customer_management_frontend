import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignupComponent} from "./pages/signup/signup.component";
import {LoginComponent} from "./pages/login/login.component";
import {HomeComponent} from "./pages/home/home.component";
import {DashboardComponent} from "./pages/admin/dashboard/dashboard.component";
import {CustomerDashboardComponent} from "./pages/customer/customer-dashboard/customer-dashboard.component";
import {AdminGuard} from "./services/admin.guard";
import {ProfileComponent} from "./pages/profile/profile.component";
import {WelcomeComponent} from "./pages/admin/welcome/welcome.component";
import {ViewCategoriesComponent} from "./pages/admin/view-categories/view-categories.component";
import {CustomerGuard} from "./services/customer.guard";
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  }, {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'admin-dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children:[
      {
        path:'',
        component: WelcomeComponent
      },
      {
        path:'profile',
        component: ProfileComponent
      },
      {
        path:'categories',
        component: ViewCategoriesComponent
      }
    ]
  },
  {
    path: 'customer-dashboard',
    component: CustomerDashboardComponent,
    pathMatch: 'full',
    canActivate: [CustomerGuard]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
