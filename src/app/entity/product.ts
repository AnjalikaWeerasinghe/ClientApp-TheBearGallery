import {Productstatus} from "./productstatus";
import {Productcategory} from "./productcategory";
import {Employee} from "./employee";

export class Product{

  public id !: number;
  public name !: string;
  public productcode !: string;
  public photo !: string;
  public productcost !: number;
  public description !: string;
  public quantity !: number;
  public rop !: number;
  public productstatus !: Productstatus;
  public productcategory !: Productcategory;
  public employee !: Employee;

  constructor(id: number, name: string, productcode: string, photo: string, productcost: number, description: string, quantity: number,
              rop: number, productstatus: Productstatus, productcategory: Productcategory, employee: Employee) {
    this.id = id;
    this.name = name;
    this.productcode = productcode;
    this.photo = photo;
    this.productcost = productcost;
    this.description = description;
    this.quantity = quantity;
    this.rop = rop;
    this.productstatus = productstatus;
    this.productcategory = productcategory;
    this.employee = employee;
  }

}
