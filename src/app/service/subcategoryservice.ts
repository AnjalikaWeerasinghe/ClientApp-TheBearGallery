import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subcategory} from "../entity/subcategory";

@Injectable({
  providedIn: 'root'
})

export class Subcategoryservice{

  constructor(private http: HttpClient) { }

  async getAllList(qry:String): Promise<Array<Subcategory>> {

    const subcategories = await this.http.get<Array<Subcategory>>('http://localhost:8080/subcategories/list'+qry).toPromise();
    if(subcategories == undefined){
      return [];
    }
    return subcategories;

  }
}
