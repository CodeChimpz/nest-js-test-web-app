import {Injectable} from "@nestjs/common";

import {createLogger, transports, format} from "winston";
import * as path from "path";

@Injectable()
export class WinstonService {
    logger: Logger

    constructor
    () {
        switch (process.env.LOGGER_ENV) {
            case("dev"):
                const LOG_DIR = 'logs'
                this.logger = new WinstonLogger([
                    new transports.Console(),
                    new transports.File({
                        filename: `${LOG_DIR}/combined.log`,
                        maxsize: 5242880, // 5MB
                    },),
                    new transports.File({
                        filename: `${LOG_DIR}/app-err.log`,
                        level: "error",
                        maxsize: 5242880, // 5MB
                    }),
                ])
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
    abstract defaultLogger
    abstract httpLogger
    abstract errorLogger
    abstract debugLogger

}

class WinstonLogger extends Logger {
    defaultLogger;
    httpLogger;
    errorLogger;
    debugLogger;


    constructor(transports) {
        super();
        const defaultStringFormat = format.printf(({label, status, data, message, timestamp}) => {
            return (`[${label}] - ` + timestamp + (status ? ` - ${status} - ` : '--') + message + "data: " + JSON.stringify(data))
        });
        const defaultSettings = {
            level: "info",
            format: format.combine(format.label({label: "APP"}), format.timestamp(), format.cli()),
            transports: transports
        }
        this.defaultLogger = createLogger(
            {...defaultSettings}
        )
        this.httpLogger = createLogger(
            {
                ...defaultSettings,
                format: format.combine(format.label({label: 'HTTP'}), format.timestamp(), format.colorize(), defaultStringFormat)
            }
        )
        this.errorLogger = createLogger(
            {
                //later
                ...defaultSettings,
                format: format.combine(format.label({label: 'ERROR'}), format.timestamp(), format.colorize(), defaultStringFormat)
            }
        )
        this.debugLogger = createLogger(
            {
                //later
                ...defaultSettings,
                format: format.combine(format.label({label: 'DEBUG'}), format.colorize(), defaultStringFormat)
            }
        )
    }

}