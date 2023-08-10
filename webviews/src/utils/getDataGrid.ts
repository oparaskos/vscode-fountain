import type { DataGrid } from '@vscode/webview-ui-toolkit';

export function getDataGridById(id: string) {
    return document.getElementById(id) as DataGrid;
}
