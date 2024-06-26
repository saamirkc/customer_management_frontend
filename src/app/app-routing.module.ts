import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {HomeComponent} from "./pages/home/home.component";
import {CustomerDashboardComponent} from "./pages/customer/customer-dashboard/customer-dashboard.component";
import {CustomerGuard} from "./services/authguard/customer.guard";
import {VerificationComponent} from "./pages/verification/verification.component";
import {AdminGuard} from "./services/authguard/admin.guard";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found.component";
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then(
        (m) => m.SignupModule
      )
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'verification/:verificationLink',
    component: VerificationComponent,
    pathMatch: 'full'
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./pages/admin/dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'customer-dashboard',
    component: CustomerDashboardComponent,
    pathMatch: 'full',
    canActivate: [CustomerGuard]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
