import {Customerstatus} from "./customerstatus";
import {Customertype} from "./customertype";
import {Employee} from "./employee";

export class Customer {

  public id !: number;
  public cusid !: string;
  public name !: string;
  public companyname !: string;
  public contactperson !: string;
  public email !: string;
  public contactmobile !: string;
  public contactland !: string;
  public address !: string;
  public customerstatus !: Customerstatus;
  public customertype !: Customertype;
  public employee !: Employee;

  constructor(id: number, cusid: string, name: string, companyname: string, contactperson: string, email: string, contactmobile: string,
              contactland: string, address: string, customerstatus: Customerstatus, customertype: Customertype, employee: Employee) {
    this.id = id;
    this.cusid = cusid;
    this.name = name;
    this.companyname = companyname;
    this.contactperson = contactperson;
    this.email = email;
    this.contactmobile = contactmobile;
    this.contactland = contactland;
    this.address = address;
    this.customerstatus = customerstatus;
    this.customertype = customertype;
    this.employee = employee;
  }

}
