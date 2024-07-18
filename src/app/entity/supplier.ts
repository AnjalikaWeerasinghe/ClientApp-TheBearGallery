import {Suppliertype} from "./suppliertype";
import {Supplierstatus} from "./supplierstatus";
import {Supcountry} from "./supcountry";

export class Supplier {

  public id !: number;
  public name !: string;
  public regid !: string;
  public contactperson !: string;
  public photo !: string;
  public contactmobile !: string;
  public contactland !: string;
  public doregistered !: string;
  public address !: string;
  public email !: string;
  public description !: string;
  public suppliertype !: Suppliertype;
  public supplierstatus !: Supplierstatus;
  public country !: Supcountry;


  constructor(id: number, name: string, regid: string, contactperson: string, photo: string, contactmobile: string,
              contactland: string, doregistered: string, address: string, email: string, description: string,
              suppliertype: Suppliertype, supplierstatus: Supplierstatus, country: Supcountry) {
    this.id = id;
    this.name = name;
    this.regid = regid;
    this.contactperson = contactperson;
    this.photo = photo;
    this.contactmobile = contactmobile;
    this.contactland = contactland;
    this.doregistered = doregistered;
    this.address = address;
    this.email = email;
    this.description = description;
    this.suppliertype = suppliertype;
    this.supplierstatus = supplierstatus;
    this.country = country;
  }
}
