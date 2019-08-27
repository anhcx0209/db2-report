import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class IbmService {

  private baseUrl = 'http://35.243.224.36:9200/ibm/_search';

  constructor(private http: HttpClient) { }
}
