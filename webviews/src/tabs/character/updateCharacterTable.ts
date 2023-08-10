import type { Badge as VSCodeBadge } from '@vscode/webview-ui-toolkit';
import type { CharacterStats } from '@/types/CharacterStats';
import { sentimentToEmoji } from '@/utils/sentimentToEmoji';
import { updateTable } from '@/utils/updateTable';
import { formatTime } from '@/utils/formatTime';
import { showGenderRepresentationStatistics } from './gender-representations';
import { showRacialIdentityRepresentationStatistics } from './racial-identity';

export function updateCharacterTable(stats: CharacterStats[]) {
    updateTable('grid-characters', stats.map((row) => ({
        "Name": row.Name,
        "Gender": row.Gender?.toUpperCase(),
        "Duration": [
            `${row?.Duration ? formatTime(row.Duration) : ''}`,
            `${row.Lines}\u00a0lines`,
            `${row.Words}\u00a0words`,
            `${row.Monologues}\u00a0monologues`
        ].filter(v => !!v).join('\u00a0\u00ad\u00a0'),
        "Reading Age": row.ReadingAge,
        "Sentiment": row?.Sentiment ? sentimentToEmoji(row.Sentiment) : undefined
    })));

    const badge = document.querySelector<VSCodeBadge>("vscode-panel-tab#tab-characters > vscode-badge");
    if (badge) { badge.innerHTML = '' + stats.length; }

    showGenderRepresentationStatistics(stats);
    showRacialIdentityRepresentationStatistics(stats);
}
