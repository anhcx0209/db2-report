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

### 0.0.1 Sep, 23 2019

- Initial release
- Worked on statics data from elastic search
- Supported:
    - Simple timerange selector
    - Simple loader when loading data
    - Graph (by [chart.js](https://www.chartjs.org))
    - Table (interactive with graphs)
    - Additional filter: show rate of read/write

### 1.0.0 Otc, 20 2019

- Use d3.js to render graph
- Graph timeline
    - user can select additional smaller timerange
    - data in graph will be zoom in/out depended on selected timerange
    - data in table will calculated by selected smaller timerange
- Worked with realtime data from EKL