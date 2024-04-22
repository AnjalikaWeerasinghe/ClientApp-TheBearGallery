import {Customerstatus} from "../entity/customerstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Customertype} from "../entity/customertype";

@Injectable({
  providedIn: 'root'
})

export class Emptypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Customertype>> {

    const empolueestpes = await this.http.get<Array<Customertype>>('http://localhost:8080/empolyeestypes/list').toPromise();
    if(empolueestpes == undefined){
      return [];
    }
    return empolueestpes;
  }

}


