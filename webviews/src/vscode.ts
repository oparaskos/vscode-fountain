export type VSCode = {
    postMessage(message: Record<string, unknown>): void;
    getState(): Record<string, unknown>;
    setState(state: Record<string, unknown>): void;
};

declare const acquireVsCodeApi: () => VSCode;

const wnd = window as any;

const acquire = acquireVsCodeApi;

if (!wnd._vscode)
    wnd._vscode = acquire();

export const vscode = wnd._vscode;
