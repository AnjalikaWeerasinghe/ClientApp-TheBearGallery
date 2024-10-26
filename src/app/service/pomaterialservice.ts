import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Purchaseorder} from "../entity/purchaseorder";
import {Pomaterial} from "../entity/pomaterial";
import {Postatus} from "../entity/postatus";

@Injectable({
  providedIn: 'root'
})

export class Pomaterialservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete(`http://localhost:8080/pomaterials/` + id).toPromise();
  }

  async update(pomaterial: Pomaterial): Promise<[]|undefined>{

    return this.http.put<[]>('http://localhost:8080/pomaterials', pomaterial).toPromise();
  }

  async getPomaterialsByPurchaseOrderId(id: number): Promise<Array<Pomaterial>> {

    const pomaterials = await this.http.get<Array<Pomaterial>>('http://localhost:8080/purorders/${id}/pomaterials').toPromise();
    if(pomaterials == undefined){
      return [];
    }
    return pomaterials;
  }


  async getAll(query:string): Promise<Array<Pomaterial>> {
    const pomaterials = await this.http.get<Array<Pomaterial>>('http://localhost:8080/pomaterials'+query).toPromise();
    if(pomaterials == undefined){
      return [];
    }
    return pomaterials;
  }

  async add(pomaterial: Pomaterial): Promise<[]|undefined>{
    //console.log("Purchase order Adding-"+JSON.stringify(purorder));
    //customer.number="47457";
    return this.http.post<[]>('http://localhost:8080/pomaterials', pomaterial).toPromise();
  }

}
