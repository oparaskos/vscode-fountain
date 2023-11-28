import { $t } from '@/components/i18n/i18n';
import { formatTime } from './formatTime';

export function dec2pct(decimal: number, nFractional: number = 0): string {
    return Math.round(decimal * 100).toFixed(nFractional)
}

export function describeSceneUtilisation(dialogueActionRatio: number, duration: number) {
    const dialogueRatio = dialogueActionRatio;
    const actionRatio = 1 - dialogueRatio;
    if (dialogueRatio > actionRatio) {
        return `${formatTime(duration)} (${$t('PERCENT_DIALOGUE', {percent: dec2pct(dialogueRatio)})})`;
    } if (actionRatio > dialogueRatio) {
        return `${formatTime(duration)} (${$t('PERCENT_ACTION', {percent: dec2pct(actionRatio)})})`;
    } else {
        return `${formatTime(duration)} (${$t('BALANCED_ACTION_DIALOGUE')})`;
    }
}
