import {Subcategory} from "./subcategory";
import {Materialstatus} from "./materialstatus";
import {Materialtype} from "./materialtype";
import {Brand} from "./brand";
import {Warehouse} from "./warehouse";
import {Category} from "./category";

export class Material{

  public id !: number;
  public name !: string;
  public itemcode !: string;
  public photo !: string;
  public quantity !: number;
  public purchasedate !: string;
  public unitprice !: number;
  public rop !: number;
  public description !: string;
  public subcategory !: Subcategory;
  public materialstatus !: Materialstatus;
  public materialtype !: Materialtype;
  public brand !: Brand;
  public warehouse !: Warehouse;
  public category !: Category;

  constructor(id: number, name: string, itemcode: string, photo: string, quantity: number, purchasedate: string, unitprice: number,
              rop: number, description: string, subcategory: Subcategory, materialstatus: Materialstatus, materialtype: Materialtype,
              brand: Brand, warehouse: Warehouse, category: Category) {
    this.id = id;
    this.name = name;
    this.itemcode = itemcode;
    this.photo = photo;
    this.quantity = quantity;
    this.purchasedate = purchasedate;
    this.unitprice = unitprice;
    this.rop = rop;
    this.description = description;
    this.subcategory = subcategory;
    this.materialstatus = materialstatus;
    this.materialtype = materialtype;
    this.brand = brand;
    this.warehouse = warehouse;
    this.category = category;
  }
}
