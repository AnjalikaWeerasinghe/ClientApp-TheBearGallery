import {Customerstatus} from "./customerstatus";
import {Customertype} from "./customertype";
import {Country} from "./country";
import {Gender} from "./gender";

export class Customer {

  public id !: number;
  public name !: string;
  public regid !: number;
  public contactperson !: string;
  public contactmobile !: string;
  public contactland !: string;
  public doregistered !: string;
  public address !: string;
  public email !: string;
  public description !: string;
  public customerstatus !: Customerstatus;
  public customertype !: Customertype;
  public country !: Country;
  public gender !: Gender;


  constructor(id: number, name: string, regid: number, contactperson: string, contactmobile: string, contactland: string,
              doregistered: string, address: string, email: string, description: string, customerstatus: Customerstatus,
              customertype: Customertype, country: Country, gender: Gender) {
    this.id = id;
    this.name = name;
    this.regid = regid;
    this.contactperson = contactperson;
    this.contactmobile = contactmobile;
    this.contactland = contactland;
    this.doregistered = doregistered;
    this.address = address;
    this.email = email;
    this.description = description;
    this.customerstatus = customerstatus;
    this.customertype = customertype;
    this.country = country;
    this.gender = gender;
  }

}
