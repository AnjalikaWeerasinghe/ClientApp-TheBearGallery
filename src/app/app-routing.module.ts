import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {PrivilegeComponent} from "./view/modules/privilege/privilege.component";
import {OperationComponent} from "./view/modules/operation/operation.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";
import {MaterialComponent} from "./view/modules/material/material.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {ProductComponent} from "./view/modules/product/product.component";
import {SupplierComponent} from "./view/modules/supplier/supplier.component";
import {CustomerComponent} from "./view/modules/customer/customer.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'main',
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "dashboard", component: DashboardComponent},
      {path: "home/dashboard", redirectTo: 'dashboard', pathMatch: 'full'},
      {path: "employee", component: EmployeeComponent},
      {path: "home/employee", redirectTo: 'employee', pathMatch: 'full'},
      {path: "user", component: UserComponent},
      {path:"privilege", component: PrivilegeComponent},
      {path: "home/privilege", redirectTo: 'privilege', pathMatch: 'full'},
      {path:"operations",component:OperationComponent},
      {path:"material",component:MaterialComponent},
      {path: "home/material", redirectTo: 'material', pathMatch: 'full'},
      {path:"product",component:ProductComponent},
      {path: "home/product", redirectTo: 'product', pathMatch: 'full'},
      {path:"supplier",component:SupplierComponent},
      {path: "home/supplier", redirectTo: 'supplier', pathMatch: 'full'},
      {path:"customer",component:CustomerComponent},
      {path: "home/customer", redirectTo: 'customer', pathMatch: 'full'},
    ]
    //{ path: '**', redirectTo: 'login', pathMatch: 'full' } // Redirect any other route to login
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
