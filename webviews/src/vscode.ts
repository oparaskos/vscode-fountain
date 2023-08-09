export type VSCode = {
    postMessage(message: Record<string, unknown>): void;
    getState<T extends Record<string, unknown> = Record<string, unknown>>(): T;
    setState<T extends Record<string, unknown> = Record<string, unknown>>(state: T): void;
};

declare global {
    interface Window { __vscode__: VSCode | null; __vscode_local_state__: Record<string, unknown> }
}

declare const acquireVsCodeApi: () => VSCode;

if (!window.__vscode__) {
    window.__vscode__ = acquireVsCodeApi();
}

export const vscode = window.__vscode__;

export const getState = vscode.getState;
export const setState = vscode.setState;
export const postMessage = vscode.postMessage;

export function patchState<T extends Record<string, unknown>>(ob: Partial<T>) {
    const state = {...getState<T>(), ...ob};
    vscode.setState<T>(state);
}
