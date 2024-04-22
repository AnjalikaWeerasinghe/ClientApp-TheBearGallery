import {Country} from "../entity/country";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class DesignationService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Country>> {

    const designations = await this.http.get<Array<Country>>('http://localhost:8080/designations/list').toPromise();
    if(designations == undefined){
      return [];
    }
    return designations;
  }

}


