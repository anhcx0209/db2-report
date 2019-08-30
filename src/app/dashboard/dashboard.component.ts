import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IbmService } from '../ibm.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Document } from '../document';
import { MatTable } from '@angular/material/table';
import * as _ from 'lodash';
import Chart from 'chart.js';
declare var $: any;
declare var daterangepicker: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataArray: Array<Document> = [];

  columnsToDisplay = ['server', 'ssid', 'schema', 'tablename', 'rps', 'wps'];

  $servernames: Observable<string[]>;
  $ssids: Observable<string[]>;
  $databases: Observable<string[]>;

  @ViewChild(MatTable, { static: true }) table0: MatTable<any>;
  @ViewChild('canvas0', { static: true }) canvas0: ElementRef;

  defaultOpts: any = {
    cutoutPercentage: 70,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        // type: 'linear',
        ticks: {
          callback(tick, index, array) {
            return (index % 3) ? '' : tick;
          }
        }
      }]
    }
  };

  constructor(private imbService: IbmService) { }

  ngOnInit() {
    this.$servernames = this.imbService.getDB2ServerName();
    this.$ssids = this.imbService.getDB2SSIDS();
    this.$databases = this.imbService.getDB2Schemas();
    $(document).ready(() => {
      $('input[name="dates"]').daterangepicker({
        "timePicker": true,
        ranges: {
          '15 min ago': [moment().subtract(15, 'minutes'), moment()],
          '1 hour ago': [moment().subtract(1, 'hours'), moment()],
          'Yesterday to now': [moment().subtract(1, 'days'), moment()],
        },
        locale: {
          format: 'YYYY-MM-DD-hh.mm.ss'
        }
      });
    });
  }

  drawRaw(docs: Array<Document>) {
    const labels = docs.sort((a, b) => {
      return a.time_current.localeCompare(b.time_current);
    }).map(value => {return value.time_current});

    const lineRead = docs.map((value, index) => {
      return {
        x: value.x_time,
        y: value.read_per_min
      }
    });
    const lineWrite = docs.map((value, index) => {
      return {
        x: value.x_time,
        y: value.write_per_min
      }
    });
    const chartData: any = {
      labels: labels,
      datasets: [
        // raw data
        {
          label: 'Avg. Reads/min',
          fill: false,
          lineTension: 0,
          borderColor: '#2424c9',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: lineRead,
        },
        {
          label: 'Avg. Writes/min',
          fill: false,
          lineTension: 0,
          borderColor: '#fc0400',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: lineWrite,
        }
      ]
    };

    const ctx = this.canvas0.nativeElement.getContext('2d');
    let chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: this.defaultOpts
    });
    return chart;
  }

  fetchData() {
    var drp = $('#dtrange').data('daterangepicker');
    const tstart = drp.startDate.format('YYYY-MM-DD-hh.mm.0000');
    const tend = drp.endDate.format('YYYY-MM-DD-hh.mm.0000');

    this.imbService.fakeSearch().subscribe(
      val => {
        val.forEach(item => {
          console.log(item._source.TimestampCurrent);
          const obj = new Document(item._source.FullName,
            parseFloat(item._source.RateReadsPerMinute),
            parseFloat(item._source.RateWritesPerMinute),
            item._source.TimestampCurrent
          );
          this.dataArray.push(obj);
        });
        this.drawRaw(this.dataArray);
        this.table0.renderRows();
      }
    );
  }

}
