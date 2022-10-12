import { _Connection } from 'vscode-languageserver';

class VSCodeLogger {
	public connection: _Connection | undefined;

	log(message: string, ...attributes: unknown[]) {
		if(this.connection) {
			this.connection.console.log('LOG:   ' + message + '\n' + JSON.stringify(attributes));
		} else {
			console.log(message, ...attributes);
		}
	}
	warn(message: string, ...attributes: unknown[]) {
		if(this.connection) {
			this.connection.console.warn('WARN:  ' + message + '\n' + JSON.stringify(attributes));
		} else {
			console.warn(message, ...attributes);
		}
	}
	error(message: string | unknown, ...attributes: unknown[]) {
		if(this.connection) {
			this.connection.console.error('ERROR: ' + message + '\n' + JSON.stringify(attributes));
		} else {
			console.error(message, ...attributes);
		}
	}
	stackTrace(error: Error, message: string | undefined = undefined) {
		if(this.connection) {
			this.connection.console.error(`ERROR: ${message || ''} ${error.name}: ${error.message}\n${error.stack}`);
		} else {
			if (message) console.error(message, error);
			else console.error(error);
		}
	}
	trace(message: string) {
		if(this.connection) {
			this.connection.console.log('TRACE: ' + message);
		} else {
			console.trace(message);
		}
	}
}

export const logger = new VSCodeLogger();