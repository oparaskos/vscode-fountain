

/** @ts-ignore @type {{ getState: function():any, setState: function(any):void, postMessage: function(any):void }} */
if (!window._vscode) 
	/** @ts-ignore @type {{ getState: function():any, setState: function(any):void, postMessage: function(any):void }} */
	window._vscode = acquireVsCodeApi();
	
/** @ts-ignore @type {{ getState: function():any, setState: function(any):void, postMessage: function(any):void }} */
export const vscode = window._vscode;


// function debugg() {
// 	const output = document.getElementById("test-data-out")!;
// 	output.innerHTML = JSON.stringify(vscode.getState(), null, 4);

// }
// window.addEventListener("DOMContentLoaded", debugg)
// setInterval(debugg, 1000);
console.log({state: vscode.getState()});