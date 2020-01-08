import { Component, OnInit, ViewChild } from '@angular/core';
import { IbmService } from '../ibm.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Document } from '../document';
import { MatTable } from '@angular/material/table';
import * as _ from 'lodash';
import { _countGroupLabelsBeforeOption } from '@angular/material/core';
import { LoaderService } from '../loader.service';
declare var $: any;
declare var daterangepicker: any;

interface Bucket {
  name: string;
  docs: Array<Document>;
}

interface NgxChartPoint {
  name: Date;
  value: number;
}

interface NgxChartLine {
  name: string;
  series: Array<NgxChartPoint>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataArray: Array<Document> = [];

  columns = [
    { isProperty: false, title: 'Col', property: 'select', hidden: false },
    { isProperty: true, title: 'System', property: 'server', hidden: false },
    { isProperty: true, title: 'SSID', property: 'ssid', hidden: false },
    { isProperty: true, title: 'Table name', property: 'tablename', hidden: false },
    { isProperty: true, title: 'Av Reads / Sec', property: 'rps', hidden: false },
    { isProperty: true, title: 'Av Writes / Sec', property: 'wps', hidden: false },
    { isProperty: true, title: 'Av Reads/Writes Ratio', property: 'rwRatio', hidden: true },
  ];

  get visibleColumns() {
    return this.columns.filter(column => column.hidden === false).map(column => column.property);
  }

  get yLabel() {
    return this.showRwRatio ? 'Ratio r/w' : 'Read per second';
  }

  columnsToDisplay = [
    'select',
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
  selection: Array<boolean> = [];

  $servernames: Observable<string[]>;
  $ssids: Observable<string[]>;
  $schemas: Observable<string[]>;

  selectedServers: Array<string> = [];
  selectedSsids: Array<string> = [];
  selectedSchemas: Array<string> = [];

  bucketArr: Array<Bucket> = [];
  selectedBucket = 0;
  chart: any;

  ngxChartLines: Array<any> = [];

  queryMessage: string;

  lineColor = [
    '#c70d3a',
    '#01d28e',
    '#434982',
    '#730068',
    '#c70d3a',
  ];

  minX: number;
  maxX: number;

  @ViewChild(MatTable, { static: true }) table0: MatTable<any>;

  constructor(private imbService: IbmService, private loaderService: LoaderService) { }

  ngOnInit() {
    this.$servernames = this.imbService.getDB2ServerName();
    this.$ssids = this.imbService.getDB2SSIDS();
    this.$schemas = this.imbService.getDB2Schemas();
    this.queryMessage = 'There is no data available. <a href="#">How to loaded it?</a>';
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

  masterToggle() {
    this.bucketArr.forEach((item, idx) => {
      this.selection[idx] = !this.selection[idx];
    });
  }

  isSelected(row) {
    return this.selection[row.tableId];
  }

  selectionHasValue() {
    return this.selection.length > 0;
  }

  isAllSelected() {
    const notSelected = this.selection.find(item => item === false);
    return notSelected === undefined;
  }

  filterResultBySelection() {
    let ret = [];
    this.bucketArr.forEach((item, index) => {
      const line = item.docs.map(value => {
        return {
          name: value.tTime,
          value: value.rps
        };
      });
      if (this.selection)
        ret.push({
          name: item.name,
          series: line
        });
    });

    return ret.filter((item, index) => {
      return this.selection[index];
    });
  }

  chartToggle(param) {
    this.selection[param.tableId] = !this.selection[param.tableId];
    this.ngxChartLines = this.filterResultBySelection();
  }

  haveNoData() {
    return this.dataArray.length === 0;
  }

  ngxDrawBucket() {
    // this.lineChart0.legend = false;
    // clear data
    this.ngxChartLines = [];
    // get data from bucket
    this.bucketArr.forEach((item, index) => {
      let line = item.docs.map(value => {
        return {
          name: moment(value.tTime).valueOf(),
          value: value.rps
        };
      });

      this.ngxChartLines.push({
        name: item.name,
        series: line
      });
    });
  }

  downloadCSV() {
    let lineArray = [];
    this.dataArray.forEach((record, index) => {
      const line = record.server + ', ' + record.ssid + ', ' + record.schema + ', ' + record.tablename + ', '
        + record.rps + ', ' + record.wps + ', ' + record.rwRatio;
      lineArray.push(index === 0 ? 'data:text/csv;charset=utf-8,' + line : line);
    });
    const csvContent = lineArray.join('\n');
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'db2_report_' + moment().unix() + '.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  }


  fetchData() {
    // start loading
    this.loaderService.show();

    this.dataArray = [];
    const drp = $('#dtrange').data('daterangepicker');
    const tstart = drp.startDate.format('YYYY-MM-DD-hh.mm.ss.SSSSSS');
    const tend = drp.endDate.format('YYYY-MM-DD-hh.mm.ss.SSSSSS');
    this.minX = drp.startDate.valueOf();
    this.maxX = drp.endDate.valueOf();

    let tablesFarmily = [];
    for (const server of this.selectedServers) {
      for (const ssid of this.selectedSsids) {
        for (const schema of this.selectedSchemas) {
          const family = server + '.' + ssid + '.' + schema;
          tablesFarmily.push(family);
        }
      }
    }

    const testJsonData = {
      query: {
        bool: {
          filter: [
            {
              range: {
                TimestampCurrent: {
                  gte: tstart,
                  lte: tend
                }
              }
            }
          ]
        }
      },

    };
    // assume that we call function for each indentified table (1 fullname)
    this.imbService.doSearch(testJsonData).then((resp) => {
      const val = resp.hits.hits;
      this.bucketArr = [];
      const tableLogs = val.map(item => {
        const d = new Document(
          0,
          item._source.DB2ServerName,
          item._source.DB2SSID,
          item._source.SchemaName,
          item._source.TableName,
          parseFloat(item._source.RateReadsPerMinute),
          parseFloat(item._source.RateWritesPerMinute),
          item._source.TimestampCurrent
        );
        return d;
      }).filter(item1 => {
        return item1.mTime.isBetween(drp.startDate, drp.endDate);
      }).filter(item2 => {
        const ix1 = this.selectedServers.findIndex(item3 => item3 === item2.server);
        const ix2 = this.selectedSsids.findIndex(item3 => item3 === item2.ssid);
        const ix3 = this.selectedSchemas.findIndex(item3 => item3 === item2.schema);
        return ix1 !== -1 && ix2 !== -1 && ix3 !== -1;
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
          if (this.bucketArr.length > 4) break;
        }
      }



      if (this.bucketArr.length > 0) {
        this.selectedBucket = 0;
        this.ngxDrawBucket();
        this.bucketArr.forEach((item, idx) => {
          let sumRead = 0;
          let sumWrite = 0;
          item.docs.forEach(element => {
            sumRead += element.readPerMin;
            sumWrite += element.writePerMin;
          });
          const splited = item.name.split('.');
          const tableSummary = new Document(idx, splited[0], splited[1], splited[2], splited[3], sumRead, sumWrite);
          this.selection.push(true);
          this.dataArray.push(tableSummary);
        });
      } else {
        this.queryMessage = 'No data for selected timeframe.  Please select another timeframe.';
        this.dataArray = [];
      }
    }).finally(() => {
      this.loaderService.hide();
    });
  }

  formatXAsisDate(val) {
    return moment(val).format('YY-MM-DD hh:mm:ss');
  }

  toggleReadWrite(event) {
    if (event.checked === true) {
      this.columns[6].hidden = false;
      this.ngxChartLines = [];
      // get data from bucket
      this.bucketArr.forEach((item, index) => {
        let line = item.docs.map(value => {
          return {
            name: moment(value.tTime).valueOf(),
            value: value.rwRatio
          };
        });
        if (line.length > 0) {
          this.ngxChartLines.push({
            name: item.name,
            series: line
          });
        }
      });
    } else {
      this.columns[6].hidden = true;
      this.ngxDrawBucket();
    }
  }

  onTimelineChange(domain) {
    const filterBegin = moment(domain[0]).format('YY-MM-DD hh:mm:ss');
    const filterEnd = moment(domain[1]).format('YY-MM-DD hh:mm:ss');
    this.dataArray = [];
    this.bucketArr.forEach((item, idx) => {
      let sumRead = 0;
      let sumWrite = 0;
      item.docs.filter(e => {
        return e.xTime >= domain[0] && e.xTime <= domain[1];
      }).forEach(element => {
        sumRead += element.readPerMin;
        sumWrite += element.writePerMin;
      });
      const splited = item.name.split('.');
      const tableSummary = new Document(idx, splited[0], splited[1], splited[2], splited[3], sumRead, sumWrite);
      this.dataArray.push(tableSummary);
    });
  }
}
