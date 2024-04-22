import {Role} from "./role";
import {User} from "./user";

export class Userrole {

  public role !: Role;
  public id !: number;
  public user !: User;


  constructor(role: Role, id: number, user: User) {
    this.role = role;
    this.id = id;
    this.user = user;
  }

}


