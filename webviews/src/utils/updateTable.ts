import { translate } from '@/components/i18n/i18n';
import { getDataGridById } from './getDataGrid';

export function updateTable(name: string, rowData: Record<string, string | number | undefined>[]) {
    const dataGrid = getDataGridById(name);
    dataGrid.rowsData = rowData.map(row =>
        Object.fromEntries(
            Object.keys(row).map(origKey => [translate(origKey), row[origKey]])
        )
    );
}
