import { Component, OnInit } from '@angular/core';
import { IbmService } from '../ibm.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
declare var $: any;
declare var daterangepicker: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataArray = [
    { col1: 1, col2: 2, col3: 3 },
    { col1: 2, col2: 2, col3: 3 },
    { col1: 3, col2: 2, col3: 3 },
    { col1: 4, col2: 2, col3: 3 },
    { col1: 5, col2: 2, col3: 3 },
    { col1: 6, col2: 2, col3: 3 },
  ];

  columnsToDisplay = ['col1', 'col2', 'col3'];

  $servernames: Observable<string[]>;
  $ssids: Observable<string[]>;
  $databases: Observable<string[]>;

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

}
