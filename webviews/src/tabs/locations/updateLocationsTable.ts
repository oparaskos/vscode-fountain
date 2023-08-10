import type { LocationsStats } from '@/types/LocationsStats';
import type { Badge as VSCodeBadge } from '@vscode/webview-ui-toolkit';

import { formatTime } from '@/utils/formatTime';
import { updateTable } from '@/utils/updateTable';


export function updateLocationsTable(stats: LocationsStats[]) {
    updateTable('grid-locations', stats.map((row) => ({
        ...row,
        Duration: formatTime(row.Duration),
    })));

    const badge = document.querySelector<VSCodeBadge>("vscode-panel-tab#tab-locations > vscode-badge");
    if (badge) { badge.innerHTML = '' + stats.length; }
}
