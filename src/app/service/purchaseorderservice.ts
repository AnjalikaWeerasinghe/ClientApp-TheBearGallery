import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Purchaseorder} from "../entity/purchaseorder";

@Injectable({
  providedIn: 'root'
})

export class Purchaseorderservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/purorders/' + id).toPromise();
  }

  async update(purorder: Purchaseorder): Promise<[]|undefined>{
    console.log("Purchase order Updating-"+purorder.id);
    return this.http.put<[]>('http://localhost:8080/purorders', purorder).toPromise();
  }


  async getAll(query:string): Promise<Array<Purchaseorder>> {
    const purorders = await this.http.get<Array<Purchaseorder>>('http://localhost:8080/purorders'+query).toPromise();
    if(purorders == undefined){
      return [];
    }
    return purorders;
  }

  async getAllList(): Promise<Array<Purchaseorder>> {
    const purorders = await this.http.get<Array<Purchaseorder>>('http://localhost:8080/purorders/list').toPromise();
    if(purorders == undefined){
      return [];
    }
    return purorders;
  }

  async add(purorder: Purchaseorder): Promise<[]|undefined>{
    //console.log("Purchase order Adding-"+JSON.stringify(purorder));
    //customer.number="47457";
    return this.http.post<[]>('http://localhost:8080/purorders', purorder).toPromise();
  }

}
