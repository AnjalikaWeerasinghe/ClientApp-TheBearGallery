import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {OperationComponent} from "./view/modules/operation/operation.component";
import {PaymentComponent} from "./view/modules/payment/payment.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},

  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "user", component: UserComponent},
      {path:"payments",component:PaymentComponent},
      {path: "home/payments", redirectTo: 'payments', pathMatch: 'full'},
      {path: "home/batchregistration", redirectTo: 'batchregistration', pathMatch: 'full'},
      {path: "home/students", redirectTo: 'students', pathMatch: 'full'},
      {path: "home/class", redirectTo: 'class', pathMatch: 'full'},
      {path: "home/books", redirectTo: 'books', pathMatch: 'full'},
      {path: "home/attendance", redirectTo: 'attendance', pathMatch: 'full'},
      {path: "home/dashboard", redirectTo: 'dashboard', pathMatch: 'full'},
      {path: "dashboard", component:DashboardComponent},
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
