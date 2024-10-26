import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productcategory} from "../entity/productcategory";

@Injectable({
  providedIn: 'root'
})

export class Productcategoryservice{

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Productcategory>> {

    const procategories = await this.http.get<Array<Productcategory>>('http://localhost:8080/productcategories/list').toPromise();
    if(procategories == undefined){
      return [];
    }
    return procategories;

  }
}
