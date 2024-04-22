import {Userstatus} from "./userstatus";
import {Userrole} from "./userrole";
import {Usertype} from "./usertype";
import {Customer} from "./customer";

export class User{

  public id !: number;
  public username !: string;
  public password !: string;
  public salt !: string;
  public confirmpassword !: string;
  public userroles!:Array<Userrole>;
  public description !: string;
  public tocreated!:string | null;
  public docreated!:string;
  public userstatus !: Userstatus;
  public usertype !: Usertype;
  public customer !: Customer;


  constructor(id: number, username: string, password: string, salt: string, confirmpassword: string, userroles: Array<Userrole>,
              description: string, tocreated: string | null, docreated: string, userstatus: Userstatus, usertype: Usertype,
              customer: Customer) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.salt = salt;
    this.confirmpassword = confirmpassword;
    this.userroles = userroles;
    this.description = description;
    this.tocreated = tocreated;
    this.docreated = docreated;
    this.userstatus = userstatus;
    this.usertype = usertype;
    this.customer = customer;
  }

}





