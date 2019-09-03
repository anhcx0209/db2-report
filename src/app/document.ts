import * as moment from 'moment';

export class Document {
    timeCurrent?: string;
    xTime?: number;
    server: string;
    ssid: string;
    schema: string;
    tablename: string;

    readPerMin: number;
    writePerMin: number;

    constructor(server: string, ssid: string, schema: string, tableName: string, rpm: number, wpm: number, ts: string = '') {
        this.readPerMin = rpm;
        this.writePerMin = wpm;
        this.server = server.trim();
        this.ssid = ssid.trim();
        this.schema = schema.trim();
        this.tablename = tableName.trim();
        if (ts.length > 0) {
            this.timeCurrent = ts;
            this.xTime = moment(ts, 'YYYY-MM-DD-hh.mm.0000').unix();
        }
    }

    get rps() {
        return this.readPerMin / 60;
    }

    get wps() {
        return this.writePerMin / 60;
    }

    get rwRatio() {
        return this.readPerMin / this.writePerMin;
    }

    get fullname() {
        return this.server + '.' + this.ssid + '.' + this.schema + '.' + this.tablename;
    }
}
