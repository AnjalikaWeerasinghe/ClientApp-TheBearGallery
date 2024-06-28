import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {DarkModeService} from "../../service/DarkModeService";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

  opened: boolean = true;

  constructor(private router: Router,public authService: AuthorizationManager,public darkModeSevice:DarkModeService) {
  }

  // invMenuItems = this.authService.invMenuItems;
  //
  // isMenuVisible(category: string): boolean {
  //   switch (category) {
  //     case 'Inventory':
  //       return this.invMenuItems.some(menuItem => menuItem.accessFlag);
  //     default:
  //       return false;
  //   }
  // }
}
