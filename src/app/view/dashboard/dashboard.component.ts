import {Component, OnInit, ViewChild} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector:'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent{
  displayedColumns = ['monthyr','provolume','totcost','revenue','profit'];
  dataSource = new MatTableDataSource<Element>(Dashboard_data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  /*@ViewChild(MatSort) sort: MatPaginator;

  ngOnInit(){
    this.dataSource.sort = this.sort;
  }*/

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface Element{
  monthyr: string;
  provolume: number;
  totcost: number;
  revenue: number;
  profit: number;
}

const Dashboard_data: Element[] = [
  {monthyr:'2024-January', provolume:1000, totcost:200500, revenue:300000, profit:100500},
  {monthyr:'2024-February', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-March', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-April', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-May', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-June', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-July', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-August', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-September', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-October', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-November', provolume:1200, totcost:210300, revenue:340000, profit:129700 },
  {monthyr:'2024-December', provolume:1200, totcost:210300, revenue:340000, profit:129700 }
];
