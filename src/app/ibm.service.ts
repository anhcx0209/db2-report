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

  private baseUrl = 'http://35.243.224.36:9200/ibm2/_search';

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

  search(jsonQuery: object) {
    return this.http.get(this.baseUrl, jsonQuery);
  }

  fakeSearch() {
    return of(
      [
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "Nm5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "2.067",
            "RateReadsPerMinute": "75.433",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-09.32.44.375968",
            "SMF127Time": "09:32:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "Pm5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "2.3",
            "RateReadsPerMinute": "70.733",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-08.32.44.375146",
            "SMF127Time": "08:32:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "Q25nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "2.267",
            "RateReadsPerMinute": "76.1",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-07.32.44.374229",
            "SMF127Time": "07:32:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "SG5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "17.567",
            "RateReadsPerMinute": "1.2",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-06.32.44.373367",
            "SMF127Time": "06:32:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "UG5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "23.767",
            "RateReadsPerMinute": "1.2",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-05.32.44.372479",
            "SMF127Time": "05:32:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "U25nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "20.367",
            "RateReadsPerMinute": "1.1",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-05.02.44.372032",
            "SMF127Time": "05:02:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "VG5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "18.1",
            "RateReadsPerMinute": "1.3",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-04.32.44.371540",
            "SMF127Time": "04:32:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "Om5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "2.033",
            "RateReadsPerMinute": "67",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-09.02.44.375577",
            "SMF127Time": "09:02:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "QW5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "1.933",
            "RateReadsPerMinute": "76.1",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-08.02.44.374701",
            "SMF127Time": "08:02:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "Rm5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "2.3",
            "RateReadsPerMinute": "73.767",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-07.02.44.373804",
            "SMF127Time": "07:02:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "Wm5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "16.6",
            "RateReadsPerMinute": "1.033",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-03.32.44.370726",
            "SMF127Time": "03:32:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "S25nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "16.467",
            "RateReadsPerMinute": "1.2",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-06.02.44.372918",
            "SMF127Time": "06:02:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "V25nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "19.3",
            "RateReadsPerMinute": "1.167",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-04.02.44.371138",
            "SMF127Time": "04:02:44:37"
          }
        },
        {
          "_index": "ibm2",
          "_type": "ibm_type",
          "_id": "XW5nxGwB-iYGNLg3aSj5",
          "_score": 0.0,
          "_source": {
            "RateWritesPerMinute": "18.367",
            "RateReadsPerMinute": "1.2",
            "IntervalInSeconds": "1,800",
            "FullName": "DALLASB.DBBG.DPTEST.EMP",
            "TimestampCurrent": "2019-07-25-03.02.44.370303",
            "SMF127Time": "03:02:44:37"
          }
        }
      ]
    );
  }
}
