import type { Panels } from '@vscode/webview-ui-toolkit';


export function getPanels(id = "root-panel") {
    return document.getElementById(id) as Panels;
}
