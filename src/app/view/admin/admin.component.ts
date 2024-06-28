import {Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {DarkModeService} from "../../service/DarkModeService";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  opened = true;

  constructor(private router: Router, public authService: AuthorizationManager, public darkModeSevice: DarkModeService) {
  }

  // admMenuItems = this.authService.admMenuItems;
  //
  // isMenuVisible(category: string): boolean {
  //   switch (category) {
  //     case 'Admin':
  //       return this.admMenuItems.some(menuItem => menuItem.accessFlag);
  //     default:
  //       return false;
  //   }
  // }

}
