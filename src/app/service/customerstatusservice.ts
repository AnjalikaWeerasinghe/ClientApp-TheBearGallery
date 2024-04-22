import {Customerstatus} from "../entity/customerstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Customerstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Customerstatus>> {

    const customerstatuses = await this.http.get<Array<Customerstatus>>('http://localhost:8080/customerstatuses/list').toPromise();
    if(customerstatuses == undefined){
      return [];
    }
    return customerstatuses;
  }

}


