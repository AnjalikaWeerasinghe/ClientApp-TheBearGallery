import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Suppliertype} from "../entity/suppliertype";

@Injectable({
  providedIn: 'root'
})


export class Suppliertypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Suppliertype>> {

    const suppliertypes = await this.http.get<Array<Suppliertype>>('http://localhost:8080/suppliertypes/list').toPromise();
    if(suppliertypes == undefined){
      return [];
    }
    return suppliertypes;
  }

}
