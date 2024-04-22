import {Category} from "./category";
import {Brand} from "./brand";

export class Categorybrand{

  public id !: number;
  public category !: Category;
  public brand !: Brand;

  constructor(id: number, category: Category, brand: Brand) {
    this.id = id;
    this.category = category;
    this.brand = brand;
  }
}
