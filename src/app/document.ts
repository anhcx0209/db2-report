import * as moment from 'moment';

export class Document {
    tableId: number;

    timeCurrent?: string;
    xTime?: number;
    tTime?: Date;
    mTime?: any;
    server: string;
    ssid: string;
    schema: string;
    tablename: string;

    readPerMin: number;
    writePerMin: number;

    constructor(tableId: number, server: string, ssid: string, schema: string, tableName: string, rpm: number, wpm: number, ts: string = '') {
        this.tableId = tableId;
        this.readPerMin = rpm;
        this.writePerMin = wpm;
        this.server = server.trim();
        this.ssid = ssid.trim();
        this.schema = schema.trim();
        this.tablename = tableName.trim();
        if (ts.length > 0) {
            this.timeCurrent = ts;
            this.mTime = moment(ts, 'YYYY-MM-DD-hh.mm.ss.SSSSSS');
            this.xTime = moment(ts, 'YYYY-MM-DD-hh.mm.ss.SSSSSS').unix();
            this.tTime = moment(ts, 'YYYY-MM-DD-hh.mm.ss.SSSSSS').toDate();
        }
    }

    get rps() {
        var num = this.readPerMin / 60;
        return num.toFixed(6);
    }

    get wps() {
        var num = this.writePerMin / 60;
        return num.toFixed(6);
    }

    get rwRatio() {
        var num = this.readPerMin / this.writePerMin;
        return num.toFixed(6);
    }

    get fullname() {
        return this.server + '.' + this.ssid + '.' + this.schema + '.' + this.tablename;
    }
}
