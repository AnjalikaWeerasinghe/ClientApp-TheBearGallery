import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Employee} from "../entity/employee";

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/employees/' + id).toPromise();
  }

  async update(employee: Employee): Promise<[]|undefined>{
    //console.log("Employee Updating-"+customer.id);
    return this.http.put<[]>('http://localhost:8080/employees', employee).toPromise();
  }


  async getAll(query:string): Promise<Array<Employee>> {
    const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees'+query).toPromise();
    if(employees == undefined){
      return [];
    }
    return employees;
  }

  async getAllListNameId(): Promise<Array<Employee>> {

    const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees/list').toPromise();
    if(employees == undefined){
      return [];
    }
    return employees;
  }

  async add(employee: Employee): Promise<[]|undefined>{
    //console.log("Employee Adding-"+JSON.stringify(customer));
    //customer.number="47457";
    return this.http.post<[]>('http://localhost:8080/employees', employee).toPromise();
  }

}


