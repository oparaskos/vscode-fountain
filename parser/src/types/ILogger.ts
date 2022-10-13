export interface ILogger {
	log(message: string, ...attributes: unknown[]): void;
	warn(message: string, ...attributes: unknown[]): void;
	error(message: string | unknown, ...attributes: unknown[]): void;
	stackTrace(error: Error, message?: string | undefined): void;
	trace(message: string): void;
}

export const EmptyLogger: ILogger = {
	log: () => {return;},
	warn: () => {return;},
	error: () => {return;},
	stackTrace: () => {return;},
	trace: () => {return;},
};
