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
    prdMenuItems = this.authService.prdMenuItems;
    supMenuItems = this.authService.supMenuItems;
    ordMenuItems = this.authService.ordMenuItems;
    resMenuItems = this.authService.resMenuItems;

  isMenuVisible(category: string): boolean {
    switch (category) {
      case 'Admin':
        return this.admMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Product':
        return this.prdMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Supplier':
        return this.supMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Order':
        return this.ordMenuItems.some(menuItem => menuItem.accessFlag);
      case 'Resource':
        return this.resMenuItems.some(menuItem => menuItem.accessFlag);
      default:
        return false;
    }
  }

}
