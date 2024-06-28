export class Warehouse{

  public id !: number;
  public location !: string;

  constructor(id: number, location: string) {
    this.id = id;
    this.location = location;
  }
}
