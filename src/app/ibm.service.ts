import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import * as elasticsearch from 'elasticsearch-browser';
import { of, pipe } from 'rxjs';
import { tap, map, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FAKE_DOCUMENTS } from './dummy';

const DB2SERVERNAMES = [
  'DALLASB'
];

const DB2SSIDS = [
  'DBBG'
];

const DB2SCHEMAS = [
  'DPTEST', 'CLTTBDB'
];

@Injectable({
  providedIn: 'root'
})
export class IbmService {

  baseUrl = 'http://35.243.224.36:9200/ibm2/_search';

  private client: Client;

  constructor() {
    if (!this.client) {
      this._connect();
    }
  }

  private _connect() {
    this.client = new elasticsearch.Client({
      host: 'http://35.243.224.36:9200',
      log: 'trace'
    });
  }

  getDB2ServerName() {
    return of(DB2SERVERNAMES);
  }

  getDB2SSIDS() {
    return of(DB2SSIDS);
  }

  getDB2Schemas() {
    return of(DB2SCHEMAS);
  }

  doSearch(searchQuery): any {
    const searchParams = {
      index: 'ibm2',
      _source: [
        'DB2ServerName',
        'DB2Version',
        'DataBaseName',
        'DB2SSID',
        'TableName',
        'SchemaName',
        'SMF127Time',
        'RateReadsPerMinute',
        'RateWritesPerMinute',
        'FullName',
        'IntervalInSeconds',
        'TimestampCurrent'
      ],
      size: 1000,
      body: searchQuery,
    };
    return this.client.search(searchParams);
  }
}
