import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Materialtype} from "../entity/materialtype";

@Injectable({
  providedIn: 'root'
})

export class Materialtypeservice{

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Materialtype>> {

  const mattypess = await this.http.get<Array<Materialtype>>('http://localhost:8080/materials/list').toPromise();
  if(mattypess == undefined){
  return [];
}
return mattypess;

}
}
