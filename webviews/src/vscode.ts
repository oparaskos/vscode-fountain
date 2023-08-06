

/** @ts-ignore @type {{ getState: function():any, setState: function(any):void, postMessage: function(any):void }} */
if (!window._vscode) 
	/** @ts-ignore @type {{ getState: function():any, setState: function(any):void, postMessage: function(any):void }} */
	window._vscode = acquireVsCodeApi();
	
/** @ts-ignore @type {{ getState: function():any, setState: function(any):void, postMessage: function(any):void }} */
export const vscode = window._vscode;
