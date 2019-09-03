import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, pipe } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FAKE_DOCUMENTS } from './dummy';

const DB2SERVERNAMES = [
  'DALLASB'
];

const DB2SSIDS = [
  'DBBG'
];

const DB2SCHEMAS = [
  'DPTESTDB', 'CLTTBDB'
];

@Injectable({
  providedIn: 'root'
})
export class IbmService {

  baseUrl = 'http://35.243.224.36:9200/ibm2/_search';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  client;

  constructor(private http: HttpClient) {
    // this.client = new Client({ node: 'http://localhost:9200' });
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

  search(jsonQuery: object) {
    return of(FAKE_DOCUMENTS);
    // Define the search parameters
    // const searchParams: RequestParams.Search<any> = {
    //   index: 'ibm2',
    //   body: jsonQuery
    // };

    // // Craft the final type definition
    // const { body } = await this.client.search({
    //   index: 'ibm2',
    //   body: jsonQuery
    // });

    // return this.http.post<any>(this.baseUrl, jsonQuery, {
    //   headers: this.httpOptions.headers,
    // }).pipe(
    //   map(val => val.hits.hits),
    //   tap(
    //     next => console.log('hits ', next),
    //     error => console.log(error.message),
    //     () => console.log('ELK completed!')
    //   )
    // );
  }
}
