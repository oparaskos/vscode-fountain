import type { ScenesStats } from '@/types/ScenesStats';
import type { ScriptTimeline } from '@/components/charts/script-timeline';
import type { Badge as VSCodeBadge } from '@vscode/webview-ui-toolkit';
import { logger } from '@/utils/logger';
import { sentimentToEmoji } from '@/utils/sentimentToEmoji';
import { describeSceneUtilisation } from '@/utils/describeSceneUtilisation';
import { updateTable } from '@/utils/updateTable';

export function updateScenesTable(stats: ScenesStats[]) {
    logger.trace("updateScenesTable");
    updateTable('grid-scenes', stats.map((row) => {
        const dialogueRatio = row.DialogueDuration / row.Duration;
        return {
            Name: row.Name,
            Characters: row.Characters,
            Synopsis: row.Synopsis,
            Duration: describeSceneUtilisation(dialogueRatio, row.Duration),
            Sentiment: sentimentToEmoji(row.Sentiment)
        };
    }));

    (document.getElementById("scenes-timeline") as ScriptTimeline).setEntries(stats);

    const badge = document.querySelector<VSCodeBadge>("vscode-panel-tab#tab-scenes > vscode-badge");
    if (badge) { badge.innerHTML = '' + stats.length; }
}
