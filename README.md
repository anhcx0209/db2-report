# IBM DB2 Dashboard

Dashboard for SMF127 records.

## How to run

- Download source code from [github](https://github.com/anhcx0209/db2-report.git)
- `npm install`
- `ng serve --port {yourport}` to run local
- `ng build` to build and serve by `nginx` or `apache`

## Usage

1. Select time range (selector will be placed at top-right)
2. Select database, then SSID, then table
3. Press "Get Result"

## Changelogs

### 0.1 Sep, 23 2019

- Initial release
- Worked on statics data from elastic search
- Supported:
    - Simple timerange selector
    - Simple loader when loading data
    - Graph (by [chart.js](https://www.chartjs.org))
    - Table (interactive with graphs)
    - Additional filter: show rate of read/write
