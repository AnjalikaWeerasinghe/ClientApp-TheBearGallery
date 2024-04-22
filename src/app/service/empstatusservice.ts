import {Customerstatus} from "../entity/customerstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Empstatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Customerstatus>> {

    const employeestatuss = await this.http.get<Array<Customerstatus>>('http://localhost:8080/employeestatuses/list').toPromise();
    if(employeestatuss == undefined){
      return [];
    }
    return employeestatuss;
  }

}


