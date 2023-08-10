import { getDataGridById } from './getDataGrid';

export function updateTable(name: string, rowData: object[]) {
    const dataGrid = getDataGridById(name);
    dataGrid.rowsData = rowData;
}
