import {Customerstatus} from "../entity/customerstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Customertype} from "../entity/customertype";
import {Usertype} from "../entity/usertype";

@Injectable({
  providedIn: 'root'
})

export class Usrtypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Usertype>> {

    const usertpes = await this.http.get<Array<Usertype>>('http://localhost:8080/usrtypes/list').toPromise();
    if(usertpes == undefined){
      return [];
    }
    return usertpes;
  }

}


