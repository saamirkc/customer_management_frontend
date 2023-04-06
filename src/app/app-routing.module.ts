import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignupComponent} from "./pages/signup/signup.component";
import {LoginComponent} from "./pages/login/login.component";
import {HomeComponent} from "./pages/home/home.component";
import {CustomerDashboardComponent} from "./pages/customer/customer-dashboard/customer-dashboard.component";
import {AdminGuard} from "./services/authguard/admin.guard";
import {ProfileComponent} from "./pages/profile/profile.component";
import {WelcomeComponent} from "./pages/admin/welcome/welcome.component";
import {ViewCustomerDetailsComponent} from "./pages/admin/view-customer-details/view-customer-details.component";
import {CustomerGuard} from "./services/authguard/customer.guard";
import {AdminDashboardComponent} from "./pages/admin/dashboard/admin-dashboard.component";

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
    loadChildren: () => import('./pages/admin/dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)
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
