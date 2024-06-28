import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Employeetype} from "../entity/employeetype";

@Injectable({
  providedIn: 'root'
})

export class Employeetypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Employeetype>> {

    const employeetypes = await this.http.get<Array<Employeetype>>('http://localhost:8080/employeetypes/list').toPromise();
    if(employeetypes == undefined){
      return [];
    }
    return employeetypes;
  }

}


