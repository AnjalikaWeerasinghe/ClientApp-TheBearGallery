import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './view/home/home.component';
import {LoginComponent} from './view/login/login.component';
import {MainwindowComponent} from './view/mainwindow/mainwindow.component';
import {UserComponent} from './view/modules/user/user.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EmployeeService} from "./service/employeeservice";
import {MatSelectModule} from "@angular/material/select";
import {ConfirmComponent} from "./util/dialog/confirm/confirm.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {DatePipe} from "@angular/common";
import {MatChipsModule} from "@angular/material/chips";
import { PrivilegeComponent } from './view/modules/privilege/privilege.component';
import {JwtInterceptor} from "./service/JwtInterceptor";
import {AuthorizationManager} from "./service/authorizationmanager";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { OperationComponent } from './view/modules/operation/operation.component';
import {MatMenuModule} from "@angular/material/menu";
import {DashboardComponent} from './view/dashboard/dashboard.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSortModule} from "@angular/material/sort";
import { MaterialComponent } from './view/modules/material/material.component';
import { InventoryComponent } from './view/inventory/inventory.component';
import { AdminComponent } from './view/admin/admin.component';
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import { ProductComponent } from './view/modules/product/product.component';
import { SupplierComponent } from './view/modules/supplier/supplier.component';
import { CustomerComponent } from './view/modules/customer/customer.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainwindowComponent,
    UserComponent,
    ConfirmComponent,
    MessageComponent,
    PrivilegeComponent,
    OperationComponent,
    DashboardComponent,
    MaterialComponent,
    InventoryComponent,
    AdminComponent,
    EmployeeComponent,
    ProductComponent,
    SupplierComponent,
    CustomerComponent,
  ],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatTooltipModule,
    MatSortModule,
  ],
  providers: [
    OperationComponent,
    EmployeeService,
    DatePipe,
    AuthorizationManager,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
