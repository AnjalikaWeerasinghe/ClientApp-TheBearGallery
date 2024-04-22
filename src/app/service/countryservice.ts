import {Country} from "../entity/country";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Countryservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Country>> {

    const countries = await this.http.get<Array<Country>>('http://localhost:8080/countries/list').toPromise();
    if(countries == undefined){
      return [];
    }
    return countries;
  }

}


