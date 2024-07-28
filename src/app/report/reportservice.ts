import {CountByDesignation} from "./entity/countbydesignation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MaterialCountByCategory} from "./entity/materialcountbycategory";

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) {  }

  async countByDesignation(): Promise<Array<CountByDesignation>> {

    const countbydesignations = await this.http.get<Array<CountByDesignation>>('http://localhost:8080/reports/countbydesignation').toPromise();
    if(countbydesignations == undefined){
      return [];
    }
    return countbydesignations;
  }

  async materialCountByCategory(): Promise<Array<MaterialCountByCategory>> {

    const countbycategories = await this.http.get<Array<MaterialCountByCategory>>('http://localhost:8080/reports/materialcountbycategory').toPromise();
    if(countbycategories == undefined){
      return [];
    }
    return countbycategories;
  }

}


