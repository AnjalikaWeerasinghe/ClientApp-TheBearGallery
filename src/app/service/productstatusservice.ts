import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productstatus} from "../entity/productstatus";

@Injectable({
  providedIn: 'root'
})

export class Productstatusservice{

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Productstatus>> {

    const productstatuses = await this.http.get<Array<Productstatus>>('http://localhost:8080/productstatuses/list').toPromise();
    if(productstatuses == undefined){
      return [];
    }
    return productstatuses;

  }

}
