import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {MaterialCountByCategory} from "../../entity/materialcountbycategory";

declare var google: any;

@Component({
  selector: 'app-materialcountbycategory',
  templateUrl: './materialcountbycategory.component.html',
  styleUrls: ['./materialcountbycategory.component.css']
})
export class MaterialcountbycategoryComponent {

  materialcountbycategory!: MaterialCountByCategory[];
  data!: MatTableDataSource<MaterialCountByCategory>;

  columns: string[] = ['name', 'count'];
  headers: string[] = ['Name', 'Count'];
  binders: string[] = ['name', 'count'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {

    this.rs.materialCountByCategory()
      .then((des: MaterialCountByCategory[]) => {
        this.materialcountbycategory = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.materialcountbycategory);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Name');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Name');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'Name');
    lineData.addColumn('number', 'Count');

    this.materialcountbycategory.forEach((des: MaterialCountByCategory) => {
      barData.addRow([des.name, des.count]);
      pieData.addRow([des.name, des.count]);
      lineData.addRow([des.name, des.count]);
    });

    const barOptions = {
      title: 'Material Count (Bar Chart)',
      subtitle: 'Count of Material by Category',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'Material Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'Material Count (Line Chart)',
      height: 400,
      width: 600
    };

    const barChart = new google.visualization.BarChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    lineChart.draw(lineData, lineOptions);

  }

}
