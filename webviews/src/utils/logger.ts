export enum LogLevel {
    OFF = 0,
    FATAL = 1,
    ERROR = 2,
    WARN = 3,
    INFO = 4,
    DEBUG = 5,
    TRACE = 6,
    ALL = 7
}

class Logger {
    private logLevel: LogLevel = LogLevel.DEBUG;

    setLogLevel(level: LogLevel) {
        this.logLevel = level;
    }

    log(message: string, ...attributes: unknown[]) {
        if (this.logLevel >= LogLevel.INFO) {
            console.log(message, ...attributes);
        }
    }

    warn(message: string, ...attributes: unknown[]) {
        if (this.logLevel >= LogLevel.WARN) {
            console.warn(message, ...attributes);
        }
    }

    error(message: string | unknown, ...attributes: unknown[]) {
        if (this.logLevel >= LogLevel.ERROR) {
            console.error(message, ...attributes);
        }
    }

    stackTrace(error: Error, message: string | undefined = undefined) {
        if (message) {
            this.error(message, error);
        } else {
            this.error(error);
        }
    }

    trace(message: string) {
        if (this.logLevel >= LogLevel.TRACE) {
            console.trace(message);
        }
    }
}

export const logger = new Logger();
