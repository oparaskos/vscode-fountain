class VSCodeLogger {
    log(message: string, ...attributes: unknown[]) {
        console.log(message, ...attributes);
    }
    warn(message: string, ...attributes: unknown[]) {
        console.warn(message, ...attributes);
    }
    error(message: string | unknown, ...attributes: unknown[]) {
        console.error(message, ...attributes);
    }
    stackTrace(error: Error, message: string | undefined = undefined) {
        if (message) console.error(message, error);
        else console.error(error);
    }
    trace(message: string) {
        console.trace(message);
    }
}

export const logger = new VSCodeLogger();
