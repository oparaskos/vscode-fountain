import type { ScenesStats } from '@/types/ScenesStats';
import type { ScreenplayTimeline } from '@/components/screenplay/screenplay-timeline';
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
            Characters: row.Characters.join(', '),
            Synopsis: row.Synopsis,
            Duration: describeSceneUtilisation(dialogueRatio, row.Duration),
            Sentiment: sentimentToEmoji(row.Sentiment)
        };
    }));

    (document.getElementById("scenes-timeline") as ScreenplayTimeline).setEntries(stats);

    const badge = document.querySelector<VSCodeBadge>("vscode-panel-tab#tab-scenes > vscode-badge");
    if (badge) { badge.textContent = '' + stats.length; }
}
