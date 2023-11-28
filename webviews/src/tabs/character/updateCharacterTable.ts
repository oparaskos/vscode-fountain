import type { Badge as VSCodeBadge } from '@vscode/webview-ui-toolkit';
import type { CharacterStats } from '@/types/CharacterStats';
import { sentimentToEmoji } from '@/utils/sentimentToEmoji';
import { updateTable } from '@/utils/updateTable';
import { formatTime } from '@/utils/formatTime';
import { showGenderRepresentationStatistics } from './gender-representations';
import { showRacialIdentityRepresentationStatistics } from './racial-identity';
import { $t } from '@/components/i18n/i18n';

export function updateCharacterTable(stats: CharacterStats[]) {
    updateTable('grid-characters', stats.map((row) => ({
        "Name": row.Name,
        "Gender": row.Gender?.toUpperCase(),
        "Duration": formatDurationContent(row),
        "Reading Age": row.ReadingAge,
        "Sentiment": row?.Sentiment ? sentimentToEmoji(row.Sentiment) : undefined
    })));

    const badge = document.querySelector<VSCodeBadge>("vscode-panel-tab#tab-characters > vscode-badge");
    if (badge) { badge.textContent = '' + stats.length; }

    showGenderRepresentationStatistics(stats);
    showRacialIdentityRepresentationStatistics(stats);
}
function formatDurationContent(row: CharacterStats): string {
    return [
        `${row?.Duration ? formatTime(row.Duration) : ''}`,
        $t('NUM_LINES', { lines: row.Lines }),
        $t('NUM_WORDS', { words: row.Words }),
        $t('NUM_MONOLOGUES', { monologues: row.Monologues }),
    ].filter(v => !!v).join('\u00a0\u00ad\u00a0');
}

