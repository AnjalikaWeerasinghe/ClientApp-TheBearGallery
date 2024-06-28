import {HttpClient} from "@angular/common/http";
import {Material} from "../entity/material";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class Materialservice{

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Material>> {

    const materials = await this.http.get<Array<Material>>('http://localhost:8080/materials'+query).toPromise();
    if(materials == undefined){
      return [];
    }
    return materials;
  }

  async getAllListNameId(): Promise<Array<Material>> {

    const materials = await this.http.get<Array<Material>>('http://localhost:8080/materials/list').toPromise();
    if(materials == undefined){
      return [];
    }
    return materials;
  }

  async add(material: Material): Promise<[]|undefined>{

    return this.http.post<[]>('http://localhost:8080/materials', material).toPromise();
  }

  async update(material: Material): Promise<[]|undefined>{

    return this.http.put<[]>('http://localhost:8080/materials', material).toPromise();
  }

}
