
const wnd = window as any;
let acquire: () => { getState: () => any, setState: (x: any) => void, postMessage: (x: any) => void };

/** @ts-ignore @type {{ getState: function():any, setState: function(any):void, postMessage: function(any):void }} */
acquire = acquireVsCodeApi;

if (!wnd._vscode)
    wnd._vscode = acquire();

export const vscode = wnd._vscode;
