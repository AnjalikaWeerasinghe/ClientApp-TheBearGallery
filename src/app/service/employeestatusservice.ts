import {Employeestatus} from "../entity/employeestatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Employeestatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Employeestatus>> {

    const employeestatuses = await this.http.get<Array<Employeestatus>>('http://localhost:8080/employeestatuses/list').toPromise();
    if(employeestatuses == undefined){
      return [];
    }
    return employeestatuses;
  }

}


