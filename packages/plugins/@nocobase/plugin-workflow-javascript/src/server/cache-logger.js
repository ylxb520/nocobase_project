import Transport from 'winston-transport';
export class CacheTransport extends Transport {
    logs = [];
    log(info, next) {
        this.logs.push(info.message);
        next();
    }
    getLogs() {
        return this.logs.slice();
    }
}
//# sourceMappingURL=cache-logger.js.map