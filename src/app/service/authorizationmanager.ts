import { Injectable } from '@angular/core';
import { AuthoritySevice } from './authoritysevice';

@Injectable()
export class AuthorizationManager {

  private readonly localStorageUserName = 'username';
  private readonly localStorageButtonKey = 'buttonState';
  private readonly localStorageAdmMenus = 'admMenuState'; //Admin
  private readonly localStoragePrdMenus = 'prdMenuState'; //Products
  private readonly localStorageSupMenus = 'supMenuState'; //Suppliers
  private readonly localStorageOrdMenus = 'ordMenuState'; //Orders
  private readonly localStorageResMenus = 'resMenuState'; //Resources

  public enaadd = false;
  public enaupd = false;
  public enadel = false;

  admMenuItems = [
    { name: 'Employee', accessFlag: true, routerLink: 'employee' },
    { name: 'User', accessFlag: true, routerLink: 'user' },
    { name: 'Privilege', accessFlag: true, routerLink: 'privilege' },
    { name: 'Operations', accessFlag: true, routerLink: 'operation' }
  ];

  prdMenuItems = [
    { name: 'Products', accessFlag: true, routerLink: 'products' },
    { name: 'Designs', accessFlag: true, routerLink: 'design' },
    { name: 'Status', accessFlag: true, routerLink: 'status' },
    { name: 'Product Warehouses', accessFlag: true, routerLink: 'prowarehouse' }
    //{ name: 'Course Material', accessFlag: true, routerLink: 'crsmaterial' }
  ];

  supMenuItems = [
    { name: 'Suppliers', accessFlag: true, routerLink: 'suppliers' },
    { name: 'Supply Material', accessFlag: true, routerLink: 'supplymaterial' },
    { name: 'Supply Payments', accessFlag: true, routerLink: 'suppayments' },
    { name: 'Purchase Orders', accessFlag: true, routerLink: 'purorders' }
  ];

  ordMenuItems = [
    { name: 'Customers', accessFlag: true, routerLink: 'customers' },
    { name: 'Orders', accessFlag: true, routerLink: 'orders' },
    { name: 'Order Payments', accessFlag: true, routerLink: 'ordpayments' }
  ];

  resMenuItems=[
    {name:'Raw Materials', accessFlag: true, routerLink: 'rawmaterials'},
    {name:'Material Distribution', accessFlag: true, routerLink: 'matdistribution'},
    {name:'Raw Mat. Warehouses', accessFlag: true, routerLink: 'rawwarehouses'},
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
    this.admMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    //production
    this.prdMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.supMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.ordMenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.resMenuItems.forEach(menuItem=> {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    })

    // Save menu state in localStorage
    localStorage.setItem(this.localStorageAdmMenus, JSON.stringify(this.admMenuItems));
    localStorage.setItem(this.localStoragePrdMenus, JSON.stringify(this.prdMenuItems));
    localStorage.setItem(this.localStorageSupMenus, JSON.stringify(this.supMenuItems));
    localStorage.setItem(this.localStorageOrdMenus, JSON.stringify(this.ordMenuItems));
    localStorage.setItem(this.localStorageResMenus, JSON.stringify(this.resMenuItems));

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
        console.log(authorities);

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

    const prdMenuState = localStorage.getItem(this.localStoragePrdMenus);
    if (prdMenuState) {
      this.prdMenuItems = JSON.parse(prdMenuState);
    }

    const supMenuState = localStorage.getItem(this.localStorageSupMenus);
    if (supMenuState) {
      this.supMenuItems = JSON.parse(supMenuState);
    }

    const ordMenuState = localStorage.getItem(this.localStorageOrdMenus);
    if (ordMenuState) {
      this.ordMenuItems = JSON.parse(ordMenuState);
    }

    const resMenuState = localStorage.getItem(this.localStorageResMenus);
    if (resMenuState){
      this.resMenuItems = JSON.parse(resMenuState);
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
    localStorage.removeItem(this.localStoragePrdMenus);
    localStorage.removeItem(this.localStorageSupMenus);
    localStorage.removeItem(this.localStorageOrdMenus);
    localStorage.removeItem(this.localStorageResMenus);
  }

  isMenuItemDisabled(menuItem: { accessFlag: boolean }): boolean {
    return !menuItem.accessFlag;
  }

}
