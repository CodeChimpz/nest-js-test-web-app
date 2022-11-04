import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {createLogger, transports, format} from "winston";
import {MysqlTransport} from "./db/winston.mysql.transport";
import * as Transport from "winston-transport";

@Injectable()
export class WinstonService {
    logger: Logger

    constructor
    (
        private mysqlTransport: MysqlTransport
    ) {
        switch (process.env.LOGGER_ENV) {
            case("test"):
                this.logger = new MysqlWinstonLogger(this.mysqlTransport)
                break;
            case("dev"):
                this.logger = new ConsoleWinstonLogger()
                break;
            case("production"):
                break;
        }
    }

    log(data, logger = null) {
        switch (logger) {
            case('http'):
                return this.logger.httpLogger.info(data)
            case('error'):
                return this.logger.errorLogger.error(data)
            case('debug'):
                return this.logger.debugLogger.debug(data)
            default:
                return this.logger.defaultLogger.info(data)
        }
    }

}

abstract class Logger {
    defaultLogger
    abstract httpLogger
    abstract errorLogger
    abstract debugLogger

    constructor(defaultSettings) {
        this.defaultLogger = createLogger({...defaultSettings})
    }
}

class MysqlWinstonLogger extends Logger {
    transport

    constructor(transport) {
        super({
            level: "info",
            format: format.combine(format.label({label: "APP"}), format.timestamp(), format.json()),
            transports: [transport]
        });
    }

    httpLogger = createLogger(
        {
            ...this.defaultLogger,
            format: format.combine(format.label({label: 'HTTP'}), format.timestamp(), format.json())
        }
    )
    errorLogger = createLogger(
        {
            //later
            ...this.defaultLogger,
            format: format.combine(format.label({label: 'ERROR'}), format.timestamp(), format.json())
        }
    )
    debugLogger = createLogger(
        {
            //later
            ...this.defaultLogger,
            format: format.combine(format.label({label: 'DEBUG'}), format.json())
        }
    )


}

class ConsoleWinstonLogger extends Logger {
    constructor() {
        super({
            level: "info",
            format: format.combine(format.label({label: "APP"}), format.timestamp(), format.cli()),
            transports: [new transports.Console()]
        });

    }

    defaultStringFormat = format.printf(({label, status, data, message, timestamp}) => {
        return (`[${label}] - ` + timestamp + (status ? ` - ${status} - ` : '--') + message + "\t data: " + JSON.stringify(data, null, '\t'))
    });

    httpLogger = createLogger(
        {
            ...this.defaultLogger,
            format: format.combine(format.label({label: 'HTTP'}), format.timestamp(), format.colorize(), this.defaultStringFormat)
        }
    )
    errorLogger = createLogger(
        {
            //later
            ...this.defaultLogger,
            format: format.combine(format.label({label: 'ERROR'}), format.timestamp(), format.colorize(), this.defaultStringFormat)
        }
    )
    debugLogger = createLogger(
        {
            //later
            ...this.defaultLogger,
            format: format.combine(format.label({label: 'DEBUG'}), format.colorize(), this.defaultStringFormat)
        }
    )
}