import type { Tag as VSCodeTag } from '@vscode/webview-ui-toolkit';
import { logger } from '@/utils/logger';
import { $t } from '@/components/i18n/i18n';
import type { ScreenplayProfilesList } from '@/components/screenplay/screenplay-profiles-list';
import { ScreenplayLocationsList } from '@/components/screenplay';
import { ScreenplayScenesList } from '@/components/screenplay/screenplay-scenes-list';
import { Statistics } from '@/types/TState';

export function updateSummaryStats({ document: summary, characters, locations, scenes }: Statistics) {
    logger.trace("updateSummaryStats");

    if (summary) {
        const nf = Intl.NumberFormat();
        (document.getElementById("num-pages") as VSCodeTag).textContent = $t("NUM_PAGES", { pages: nf.format(summary.NumPages || 0) });
        (document.getElementById("num-words") as VSCodeTag).textContent = $t("NUM_WORDS", { words: nf.format(summary.NumWords || 0) });
        (document.getElementById("num-lines") as VSCodeTag).textContent = $t("NUM_LINES", { lines: nf.format(summary.NumLines || 0) });
    }

    if (characters) {
        const topThreeCharacters = characters.sort((a, b) => (b.Duration || 0) - (a.Duration || 0)).filter((v, i, a) => i < 3);
        (document.getElementById("top-three-profiles") as ScreenplayProfilesList).setEntries(topThreeCharacters);
    }
    if (locations) {
        const topThreeLocations = locations.sort((a, b) => (b.Duration || 0) - (a.Duration || 0)).filter((v, i, a) => i < 3);
        (document.getElementById("top-three-locations") as ScreenplayLocationsList).setEntries(topThreeLocations);
    }
    if (scenes) {
        const topThreeScenes = scenes.sort((a, b) => (b.Duration || 0) - (a.Duration || 0)).filter((v, i, a) => i < 3);
        (document.getElementById("top-three-scenes") as ScreenplayScenesList).setEntries(topThreeScenes);
    }

}
