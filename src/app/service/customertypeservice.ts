import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Customertype} from "../entity/customertype";

@Injectable({
  providedIn: 'root'
})

export class Customertypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Customertype>> {

    const customertypes = await this.http.get<Array<Customertype>>('http://localhost:8080/customertypes/list').toPromise();
    if(customertypes == undefined){
      return [];
    }
    return customertypes;
  }

}


