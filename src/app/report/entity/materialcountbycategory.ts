export class MaterialCountByCategory {

  public id !: number;
  public name !: string;
  public count !: number;

  constructor(id:number,name:string,count:number) {
    this.id=id;
    this.name=name;
    this.count=count;
  }

}
