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

interface Bucket {
  name: string;
  docs: Array<Document>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataArray: Array<Document> = [];

  columnsToDisplay = [
    'server',
    'ssid',
    'schema',
    'tablename',
    'rps',
    'wps',
    'rwRatio'
  ];
  showRwRatio: false;
  modTimeFrame: false;

  $servernames: Observable<string[]>;
  $ssids: Observable<string[]>;
  $schemas: Observable<string[]>;

  selectedServers = [];
  selectedSsids = [];
  selectedSchemas = [];

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
    this.$schemas = this.imbService.getDB2Schemas();
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
    }).map(value => { return value.time_current });

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

    const lineRatio = docs.map((value, index) => {
      return {
        x: value.x_time,
        y: value.rwRatio
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
        },
        {
          label: 'Reads/Write Ratio',
          fill: false,
          lineTension: 0,
          borderColor: '#ffea00',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: lineRatio,
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
    this.dataArray = [];
    var drp = $('#dtrange').data('daterangepicker');
    const tstart = drp.startDate.format('YYYY-MM-DD-hh.mm.000000');
    const tend = drp.endDate.format('YYYY-MM-DD-hh.mm.000000');
    console.log(tstart);
    console.log(tend);
    const tablesFarmily = [];
    for (var i = 0; i < this.selectedServers.length; ++i) {
      for (var j = 0; j < this.selectedSsids.length; ++j) {
        for (var k = 0; k < this.selectedSchemas.length; ++k) {
          const faimly = this.selectedServers[i] + this.selectedSsids[j] + this.selectedSchemas[k];
          console.log(faimly);
          tablesFarmily.push(faimly)
        }
      }
    }
    const testJsonData = {
      "_source": [
        "SMF127Time",
        "RateReadsPerMinute",
        "RateWritesPerMinute",
        "FullName",
        "IntervalInSeconds",
        "TimestampCurrent"
      ],
      "query": {
        "bool": {
          "filter": [
            {
              "term": {
                "FullName.keyword": "DALLASB.DBBG.DPTEST.EMP"
              }
            },
            {
              "range": {
                "TimestampCurrent": {
                  "gte": tstart,
                  "lte": tend
                }
              }
            }
          ]
        }
      },
      "size": 1000
    };    
    this.imbService.isAvailable().then(
      () => {
        console.log('OK, connected')
      }, error => {        
        console.error('Server is down', error);
      }
    );
    // assume that we call function for each indentified table (1 fullname)
    // this.imbService.search(testJsonData).subscribe(
    //   val => {
    //     let tbName = '';
    //     const tableLogs = val.map(item => {
    //       tbName = item._source.FullName;
    //       return new Document(item._source.FullName,
    //         parseFloat(item._source.RateReadsPerMinute),
    //         parseFloat(item._source.RateWritesPerMinute),
    //         item._source.TimestampCurrent
    //       );
    //     });
    //     this.drawRaw(tableLogs);

    //     // cal

    //     let sumRead = 0;
    //     let sumWrite = 0;
    //     tableLogs.forEach(element => {
    //       sumRead += element.read_per_min;
    //       sumWrite += element.write_per_min;
    //     });
    //     const tableSummary = new Document(tbName, sumRead, sumWrite);
    //     this.dataArray.push(tableSummary);
    //     this.table0.renderRows();
    //   }
    // );
  }

}
