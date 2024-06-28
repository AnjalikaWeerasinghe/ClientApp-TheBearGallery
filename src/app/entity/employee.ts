import {Employeestatus} from "./employeestatus";
import {Employeetype} from "./employeetype";
import {Country} from "./country";
import {Gender} from "./gender";
import {Designation} from "./designation";

export class Employee {

  public id !: number;
  public fullname !: string;
  public regid !: string;
  public callingname !: string;
  public nic !: string;
  public photo !: string;
  public dobirth !: string;
  public contactmobile !: string;
  public contactland !: string;
  public doregistered !: string;
  public address !: string;
  public email !: string;
  public description !: string;
  public empstatus !: Employeestatus;
  public emptype !: Employeetype;
  public country !: Country;
  public gender !: Gender;
  public designation !: Designation;

  constructor(id: number, fullname: string, regid: string, callingname: string, nic: string, photo: string, dobirth: string,
              contactmobile: string, contactland: string, doregistered: string, address: string, email: string, description: string,
              empstatus: Employeestatus, emptype: Employeetype, country: Country, gender: Gender, designation: Designation) {
    this.id = id;
    this.fullname = fullname;
    this.regid = regid;
    this.callingname = callingname;
    this.nic = nic;
    this.photo = photo;
    this.dobirth = dobirth;
    this.contactmobile = contactmobile;
    this.contactland = contactland;
    this.doregistered = doregistered;
    this.address = address;
    this.email = email;
    this.description = description;
    this.empstatus = empstatus;
    this.emptype = emptype;
    this.country = country;
    this.gender = gender;
    this.designation = designation;
  }
}
