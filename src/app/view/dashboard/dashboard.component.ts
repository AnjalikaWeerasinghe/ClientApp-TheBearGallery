import {Component} from "@angular/core";

@Component({
  selector:'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent{

  userspecmessages: any[] = [
    {name: 'ashan.d@earth.lk', updated: new Date('5/30/23')},
    {name: 'rukmal.d@earth.lk', updated: new Date('5/17/23')},
    {name: 'it@earth.lk', updated: new Date('5/28/23')},
    {name: 'it@earth.lk', updated: new Date('4/28/23')},
  ];

  generalmessages: any[] = [
    {name: 'hr@earth.lk', updated: new Date('5/30/23')},
    {name: 'admin@earth.lk', updated: new Date('5/17/23')},
    {name: 'it@earth.lk', updated: new Date('5/28/23')},
    {name: 'it@earth.lk', updated: new Date('4/28/23')}
  ];
}
