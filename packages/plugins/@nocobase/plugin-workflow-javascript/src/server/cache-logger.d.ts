import Transport from 'winston-transport';
export declare class CacheTransport extends Transport {
    private logs;
    log(info: any, next: () => void): any;
    getLogs(): string[];
}
