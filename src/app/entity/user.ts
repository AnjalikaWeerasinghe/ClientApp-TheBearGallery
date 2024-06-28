import {Userstatus} from "./userstatus";
import {Userrole} from "./userrole";
import {Usertype} from "./usertype";
import {Employee} from "./employee";

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
  public employee !: Employee;

  constructor() {

  }


}





