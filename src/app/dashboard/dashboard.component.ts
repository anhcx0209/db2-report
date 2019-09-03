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

  bucketArr: Array<Bucket> = [];
  selectedBucket = 0;
  chart: any;

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
        timePicker: true,
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
      return a.timeCurrent.localeCompare(b.timeCurrent);
    }).map(value => value.timeCurrent);

    const lineRead = docs.map((value, index) => {
      return {
        x: value.xTime,
        y: value.readPerMin
      };
    });
    const lineWrite = docs.map((value, index) => {
      return {
        x: value.xTime,
        y: value.writePerMin
      };
    });

    const lineRatio = docs.map((value, index) => {
      return {
        x: value.xTime,
        y: value.rwRatio
      };
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
    this.chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: this.defaultOpts
    });
    return this.chart;
  }



  fetchData() {
    this.dataArray = [];
    const drp = $('#dtrange').data('daterangepicker');
    const tstart = drp.startDate.format('YYYY-MM-DD-hh.mm.ss0000');
    const tend = drp.endDate.format('YYYY-MM-DD-hh.mm.ss0000');
    console.log(tstart);
    console.log(tend);
    let tablesFarmily = [];
    for (const server of this.selectedServers) {
      for (const ssid of this.selectedSsids) {
        for (const schema of this.selectedSchemas) {
          const family = server + '.' + ssid + '.' + schema;
          console.log(family);
          tablesFarmily.push(family);
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
    // assume that we call function for each indentified table (1 fullname)
    this.imbService.search(testJsonData).subscribe(
      val => {
        this.bucketArr = [];
        const tableLogs = val.filter((item) => {
          const t1 = moment(item._source.TimestampCurrent, 'YYYY-MM-DD-hh.mm.ss0000');
          return t1.isSameOrAfter(drp.startDate) && t1.isSameOrBefore(drp.endDate);
        }).map(item => {
          const newItem = new Document(
            item._source.DB2ServerName,
            item._source.DB2SSID,
            item._source.DataBaseName,
            item._source.TableName,
            parseFloat(item._source.RateReadsPerMinute),
            parseFloat(item._source.RateWritesPerMinute),
            item._source.TimestampCurrent
          );
          return newItem;
        });
        for (const tableLog of tableLogs) {
          const idx = this.bucketArr.findIndex((item) => item.name === tableLog.fullname);
          if (idx !== -1) {
            this.bucketArr[idx].docs.push(tableLog);
          } else {
            const bck = {
              name: tableLog.fullname,
              docs: [tableLog]
            };
            this.bucketArr.push(bck);
          }
        }
        this.drawRaw(this.bucketArr[0].docs);
        this.bucketArr.forEach(item => {
          let sumRead = 0;
          let sumWrite = 0;
          item.docs.forEach(element => {
            sumRead += element.readPerMin;
            sumWrite += element.writePerMin;
          });
          const splited = item.name.split('.');
          const tableSummary = new Document(splited[0], splited[1], splited[2], splited[3], sumRead, sumWrite);
          this.dataArray.push(tableSummary);
        });
        this.table0.renderRows();
      }
    );
  }

  changeBucket($event) {
    this.chart.destroy();
    const ctx0 = this.canvas0.nativeElement.getContext('2d');
    ctx0.clearRect(0, 0, this.canvas0.nativeElement.width, this.canvas0.nativeElement.height);
    this.drawRaw(this.bucketArr[$event.value].docs);
  }
}
