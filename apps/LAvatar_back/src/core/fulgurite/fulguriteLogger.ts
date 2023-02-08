
import _ from 'lodash'
import winston from 'winston'
import winstonDailyRotateFile from 'winston-daily-rotate-file'
import Transport from 'winston-transport';
/**
 * @typedef {object}    CONFIG_LOG
 * @property {string}  [file_level='debug']
 * @property {string}  [console_level='debug']
 * @property {string}  [logPath='./log']
 */

/**
 * @param userTransports
 * @param {CONFIG_LOG} config
 * @returns {winston.Logger}
 */



function createLogger(userTransports: Transport[] | null, config: any = {}) {
    const transports = userTransports || [];

    // Winston Daily Rotate File : https://github.com/winstonjs/winston-daily-rotate-file
    const LOG_FILE_LEVEL = config.file_level || 'debug';
    if (LOG_FILE_LEVEL !== 'disable') {
        let defaultOptions = {
            level: LOG_FILE_LEVEL,
            dirname: config.logPath || './log',
            filename: `${process.env.npm_package_name}-%DATE%.log`,
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '50',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        };
        let rotatedTransport = new winstonDailyRotateFile(_.assign({}, defaultOptions, config));
        /**
         * @property {function} winston.transports.DailyRotateFile.prototype.on - rotate hook
         */
        rotatedTransport.on('rotate', function (oldFilename, newFilename) {
            logger.info('logfile rotated, oldFileName: ' + oldFilename + ', newFileName' + newFilename);
        });
        transports.push(rotatedTransport);
    }

    // Winston Console Transports
    const LOG_CONSOLE_LEVEL = config.console_level || 'debug';
    if (LOG_CONSOLE_LEVEL !== 'disabled') {
        // https://github.com/winstonjs/winston/blob/master/docs/transports.md
        let consoleTransport = new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.align(),
                winston.format.timestamp(),
                winston.format.printf((info) => {
                    const { timestamp, level, message, ...args } = info;
                    const ts = timestamp.replace('T', ' ');
                    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? '\n' + prettyJ(args) : ''}`;
                }),
            ),
            level: LOG_CONSOLE_LEVEL,
        });
        transports.push(consoleTransport);
    }

    const logger: winston.Logger = winston.createLogger({
        levels: winston.config.syslog.levels,
        transports: transports,
    });

    // colorize stringified json on terminal
    function prettyJ(json: any) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        return json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
            function (match: string) {
                let cls = '\x1b[36m';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = '\x1b[34m';
                    } else {
                        cls = '\x1b[32m';
                    }
                } else if (/true|false/.test(match)) {
                    cls = '\x1b[35m';
                } else if (/null/.test(match)) {
                    cls = '\x1b[31m';
                }
                return cls + match + '\x1b[0m';
            },
        );
    }

    /**
     * @alias
     * @deprecated use warning instead
     * @returns {Logger}
     */
    logger.warn = logger.warning;

    return logger;
}

export default createLogger;