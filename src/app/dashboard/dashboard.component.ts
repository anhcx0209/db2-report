import { Component, OnInit } from '@angular/core';
import { IbmService } from '../ibm.service';
import { Observable } from 'rxjs';

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
  }

}
