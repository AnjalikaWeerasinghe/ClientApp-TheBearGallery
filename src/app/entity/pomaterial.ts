import {Purchaseorder} from "./purchaseorder";
import {Material} from "./material";

export class Pomaterial {

  public id !: number;
  public quantity !: number;
  public unitprice !: number;
  public totprice !: number;
  public purchaseorder !: Purchaseorder;
  public material !: Material;

  constructor(id: number, quantity: number, unitprice: number, totprice: number, purchaseorder: Purchaseorder, material: Material) {
    this.id = id;
    this.quantity = quantity;
    this.unitprice = unitprice;
    this.totprice = totprice;
    this.purchaseorder = purchaseorder;
    this.material = material;
  }

}
