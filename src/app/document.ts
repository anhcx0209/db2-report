import * as moment from 'moment';

export class Document {
    time_current: string;
    duration: number;
    x_time: number;

    fullname: string;
    server: string;
    ssid: string;
    schema: string;
    tablename: string;

    read_per_min: number;
    write_per_min: number;

    constructor(fn: string, rpm: number, wpm: number, ts: string) {
        this.read_per_min = rpm;
        this.write_per_min = wpm;
        this.fullname = fn;
        const parts = fn.split('.');
        this.server = parts[0];
        this.ssid = parts[1];
        this.schema = parts[2];
        this.tablename = parts[3];
        this.time_current = ts;


        this.x_time = moment(ts, "YYYY-MM-DD-hh.mm.0000").unix();
        console.log(this.x_time);
    }

    get rps() {
        return this.read_per_min / 60;
    }

    get wps() {
        return this.write_per_min / 60;
    }
}
