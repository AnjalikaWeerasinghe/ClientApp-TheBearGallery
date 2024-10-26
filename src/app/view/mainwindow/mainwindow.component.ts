import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {DarkModeService} from "../../service/DarkModeService";


@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent {

  opened: boolean = true;

  constructor(private router: Router,public authService: AuthorizationManager,public darkModeSevice:DarkModeService) {
  }


  logout(): void {
    this.router.navigateByUrl("login")
    this.authService.clearUsername();
    this.authService.clearButtonState();
    this.authService.clearMenuState();
    localStorage.removeItem("Authorization");
  }
    admMenuItems = this.authService.admMenuItems;
    invMenuItems = this.authService.invMenuItems;
    purMenuItems = this.authService.purMenuItems;
    salMenuItems = this.authService.salMenuItems;

  isMenuVisible(category: string): boolean {
    switch (category) {
      case 'Admin':
        // console.log(this.admMenuItems);
        return this.admMenuItems.some(item => item.accessFlag);
      case 'Inventory':
        // console.log(this.invMenuItems);
        return this.invMenuItems.some(item => item.accessFlag);
      case 'Purchases':
        // console.log(this.purMenuItems);
        return this.purMenuItems.some(item => item.accessFlag);
      case 'Sales':
        // console.log(this.salMenuItems);
        return this.salMenuItems.some(item => item.accessFlag);
      default:
        return false;
    }
  }



}
