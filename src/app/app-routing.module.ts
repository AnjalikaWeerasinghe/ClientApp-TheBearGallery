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
import {PurchaseorderComponent} from "./view/modules/purchaseorder/purchaseorder.component";
import {SalesorderComponent} from "./view/modules/salesorder/salesorder.component";
import {DailyproductionComponent} from "./view/dailyproduction/dailyproduction.component";
import {CountbydesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {
  MaterialcountbycategoryComponent
} from "./report/view/materialcountbycategory/materialcountbycategory.component";

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
      {path: "home/reports", redirectTo: 'report', pathMatch: 'full'},
      {path: "report", component: CountbydesignationComponent},
      {path: "dailyproduction", component: DailyproductionComponent},
      {path: "home/dailyproduction", redirectTo: 'dailyproduction', pathMatch: 'full'},
      {path: "employee", component: EmployeeComponent},
      {path: "home/employee", redirectTo: 'employee', pathMatch: 'full'},
      {path: "user", component: UserComponent},
      {path:"privilege", component: PrivilegeComponent},
      {path: "home/privilege", redirectTo: 'privilege', pathMatch: 'full'},
      {path:"operation",component:OperationComponent},
      {path:"material",component:MaterialComponent},
      {path: "home/material", redirectTo: 'material', pathMatch: 'full'},
      {path:"product",component:ProductComponent},
      {path: "home/product", redirectTo: 'product', pathMatch: 'full'},
      {path:"supplier",component:SupplierComponent},
      {path: "home/supplier", redirectTo: 'supplier', pathMatch: 'full'},
      {path:"purchaseorder",component:PurchaseorderComponent},
      {path:"customer",component:CustomerComponent},
      {path: "home/customer", redirectTo: 'customer', pathMatch: 'full'},
      {path:"salesorder",component:SalesorderComponent},
      {path: "home/countbydesignation", redirectTo: 'countbydesignation', pathMatch: 'full'},
      {path:"countbydesignation",component:CountbydesignationComponent},
      {path: "home/materialcountbycategory", redirectTo: 'materialcountbycategory', pathMatch: 'full'},
      {path:"materialcountbycategory",component:MaterialcountbycategoryComponent},
    ]
    //{ path: '**', redirectTo: 'login', pathMatch: 'full' } // Redirect any other route to login
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
