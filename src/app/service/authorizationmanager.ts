import { Injectable } from '@angular/core';
import { AuthoritySevice } from './authoritysevice';

@Injectable()
export class AuthorizationManager {

  private readonly localStorageUserName = 'username';
  private readonly localStorageButtonKey = 'buttonState';
  private readonly localStorageAdmMenus = 'admMenuState'; //Admin
  private readonly localStorageInvMenus = 'invMenuState'; //Inventory
  private readonly localStoragePurMenus = 'purMenuState';//Purchases
  private readonly localStorageSalMenus = 'salMenuState';

  public enaadd = false;
  public enaupd = false;
  public enadel = false;

  admMenuItems = [
    { name: 'Employee', accessFlag: true, routerLink: 'employee' },
    { name: 'User', accessFlag: true, routerLink: 'user' },
    { name: 'Privilege', accessFlag: true, routerLink: 'privilege' },
    { name: 'Operations', accessFlag: true, routerLink: 'operations' }
  ];

  invMenuItems = [
    {name: 'Materials', accessFlag: true, routerLink: 'material'},
    {name: 'Products', accessFlag: true, routerLink: 'product'}
  ];

  purMenuItems = [
    {name: 'Suppliers', accessFlag: true, routerLink: 'supplier'},
    {name: 'Purchase Orders', accessFlag: true, routerLink: 'purchaseorder'}
  ];

  salMenuItems = [
    {name: 'Customer', accessFlag: true, routerLink: 'customer'},
    {name: 'Sales Order', accessFlag: true, routerLink: 'salesorder'}
  ];

  constructor(private am: AuthoritySevice) {}

  enableButtons(authorities: { module: string; operation: string }[]): void {
    this.enaadd = authorities.some(authority => authority.operation === 'insert');
    this.enaupd = authorities.some(authority => authority.operation === 'update');
    this.enadel = authorities.some(authority => authority.operation === 'delete');

    // Save button state in localStorage
    localStorage.setItem(this.localStorageButtonKey, JSON.stringify({ enaadd: this.enaadd, enaupd: this.enaupd, enadel: this.enadel }));
  }

  enableMenues(modules: { module: string; operation: string }[]): void {
    this.admMenuItems.forEach(item => {
      item.accessFlag = modules.some(module => module.module.toLowerCase() === item.name.toLowerCase());
    });

    this.invMenuItems.forEach(item=> {
      // console.log("Checking item: ", item.name);
      item.accessFlag = modules.some(module => module.module.toLowerCase() === item.name.toLowerCase());
      // console.log("Access flag for ", item.name, ": ", item.accessFlag);
    });

    this.purMenuItems.forEach(item=> {
      // console.log("Checking item: ", item.name);
      item.accessFlag = modules.some(module => module.module.toLowerCase() === item.name.toLowerCase());
      // console.log("Access flag for ", item.name, ": ", item.accessFlag);
    });

    this.salMenuItems.forEach(item=> {
      item.accessFlag = modules.some(module => module.module.toLowerCase() === item.name.toLowerCase());
    });

    // Save menu state in localStorage
    localStorage.setItem(this.localStorageAdmMenus, JSON.stringify(this.admMenuItems));
    localStorage.setItem(this.localStorageInvMenus, JSON.stringify(this.invMenuItems));
    localStorage.setItem(this.localStoragePurMenus, JSON.stringify(this.purMenuItems));
    localStorage.setItem(this.localStorageSalMenus, JSON.stringify(this.salMenuItems));
  }


  async getAuth(username: string): Promise<void> {

    this.setUsername(username);

    try {
      const result = await this.am.getAutorities(username);
      if (result !== undefined) {
        const authorities = result.map(authority => {
          const [module, operation] = authority.split('-');
          return { module, operation };
        });
        // console.log(authorities);

        this.enableButtons(authorities);
        this.enableMenues(authorities);

      } else {
        console.log('Authorities are undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }

  getUsername(): string {
    return localStorage.getItem(this.localStorageUserName) || '';
  }

  setUsername(value: string): void {
    localStorage.setItem(this.localStorageUserName, value);
  }

  getEnaAdd(): boolean {
    return this.enaadd;
  }

  getEnaUpd(): boolean {
    return this.enaupd;
  }

  getEnaDel(): boolean {
    return this.enadel;
  }

  initializeButtonState(): void {
    const buttonState = localStorage.getItem(this.localStorageButtonKey);
    if (buttonState) {
      const { enaadd, enaupd, enadel } = JSON.parse(buttonState);
      this.enaadd = enaadd;
      this.enaupd = enaupd;
      this.enadel = enadel;
    }
  }

  initializeMenuState(): void {
    const admMenuState = localStorage.getItem(this.localStorageAdmMenus);
    if (admMenuState) {
      this.admMenuItems = JSON.parse(admMenuState);
    }

    const invMenuState = localStorage.getItem(this.localStorageInvMenus);
    if (invMenuState) {
      this.invMenuItems = JSON.parse(invMenuState);
    }

    const purMenuState = localStorage.getItem(this.localStoragePurMenus);
    if (purMenuState) {
      this.purMenuItems = JSON.parse(purMenuState);
    }

    const salMenuState = localStorage.getItem(this.localStorageSalMenus);
    if (salMenuState) {
      this.salMenuItems = JSON.parse(salMenuState);
    }

  }

  clearUsername(): void {
    localStorage.removeItem(this.localStorageUserName);
  }

  clearButtonState(): void {
    localStorage.removeItem(this.localStorageButtonKey);
  }

  clearMenuState(): void {
    localStorage.removeItem(this.localStorageAdmMenus);
    localStorage.removeItem(this.localStorageInvMenus);
    localStorage.removeItem(this.localStoragePurMenus);
    localStorage.removeItem(this.localStorageSalMenus);
  }

  isMenuItemDisabled(item: { accessFlag: boolean }): boolean {
    return !item.accessFlag;
  }

}
