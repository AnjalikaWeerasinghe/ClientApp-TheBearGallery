import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Usertype} from "../entity/usertype";

@Injectable({
  providedIn: 'root'
})

export class Usertypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Usertype>> {

    const usertypes = await this.http.get<Array<Usertype>>('http://localhost:8080/usertypes/list').toPromise();
    if(usertypes == undefined){
      return [];
    }
    return usertypes;
  }

}


