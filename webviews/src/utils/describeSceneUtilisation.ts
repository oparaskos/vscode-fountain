import { formatTime } from './formatTime';

export function describeSceneUtilisation(dialogueActionRatio: number, duration: number) {
    const dialogueRatio = dialogueActionRatio;
    const actionRatio = 1 - dialogueRatio;
    if (dialogueRatio > actionRatio) {
        return `${formatTime(duration)} (${Math.round(dialogueRatio * 100).toFixed(0)}%\u00a0Dialogue)`;
    } if (actionRatio > dialogueRatio) {
        return `${formatTime(duration)} (${Math.round(actionRatio * 100).toFixed(0)}%\u00a0Action)`;
    } else {
        return `${formatTime(duration)} (Balanced\u00a0Action\u00a0/\u00a0Dialogue)`;
    }
}
