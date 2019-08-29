import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

const DB2SERVERNAMES = [
  'DALLASB'
];

const DB2SSIDS = [
  'DBBG'
];

const DB2SCHEMAS = [
  'DBBGDPTESTDB', 'CLTTBDB'
];

@Injectable({
  providedIn: 'root'
})
export class IbmService {

  private baseUrl = 'http://35.243.224.36:9200/ibm/_search';

  constructor(private http: HttpClient) { }

  getDB2ServerName() {
    return of(DB2SERVERNAMES);
  }

  getDB2SSIDS() {
    return of(DB2SSIDS);
  }

  getDB2Schemas() {
    return of(DB2SCHEMAS);
  }
}
