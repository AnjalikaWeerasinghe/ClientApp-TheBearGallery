import {Postatus} from "./postatus";
import {Supplier} from "./supplier";
import {Employee} from "./employee";

export class Purchaseorder {

  public id !: number;
  public poid !: string;
  public doorder !: string;
  public createdby !: string;
  public description !: string;
  public postatus !: Postatus;
  public supplier !: Supplier;
  public employee !: Employee;

  constructor(id: number, poid: string, doorder: string, createdby: string, description: string, postatus: Postatus,
              supplier: Supplier, employee: Employee) {
    this.id = id;
    this.poid = poid;
    this.doorder = doorder;
    this.createdby = createdby;
    this.description = description;
    this.postatus = postatus;
    this.supplier = supplier;
    this.employee = employee;
  }

}
