import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Supcountry} from "../entity/supcountry";

@Injectable({
  providedIn: 'root'
})

export class Supcountryservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Supcountry>> {

    const supcountries = await this.http.get<Array<Supcountry>>('http://localhost:8080/supcountries/list').toPromise();
    if(supcountries == undefined){
      return [];
    }
    return supcountries;
  }

}
