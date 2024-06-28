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
import {InventoryComponent} from "./view/inventory/inventory.component";
import {AdminComponent} from "./view/admin/admin.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {ProductComponent} from "./view/modules/product/product.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'main',
    component: MainwindowComponent,
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'dashboard', component:DashboardComponent},
      {path: 'home/dashboard', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'admin',
        component: AdminComponent,
        children: [
          {path: '', redirectTo: 'user', pathMatch: 'full'},
          {path: 'user', component: UserComponent},
          {path: 'employee', component:EmployeeComponent},
          {path: 'employee', redirectTo:'employee', pathMatch:'full'},
          {path: 'privilege', component:PrivilegeComponent},
          {path: 'privilege', redirectTo:'privilege', pathMatch:'full'},
          {path: 'operation', component:OperationComponent},
          {path: 'operation', redirectTo:'operation', pathMatch:'full'},
        ]
      },
      {path: 'home/admin', redirectTo:'admin', pathMatch:'full'},
      {
        path: 'inventory',
        component:InventoryComponent,
        children: [
          {path: 'material', component:MaterialComponent},
          {path: '', redirectTo:'material', pathMatch:'full'},
          {path: 'product', component:ProductComponent},
          {path: 'product', redirectTo:'product', pathMatch:'full'},
        ]
      },
      {path: 'home/inventory', redirectTo:'inventory', pathMatch:'full'},

    ]
    //{ path: '**', redirectTo: 'login', pathMatch: 'full' } // Redirect any other route to login
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
