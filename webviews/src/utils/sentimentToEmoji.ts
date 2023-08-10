
export function sentimentToEmoji(sentiment: number | null) {
    if (sentiment !== 0 && !sentiment) return '∅';

    const emojiIndex = Math.max(-5, Math.min(5, Math.round(sentiment))) + 5;
    // Sentimenent is only guessing at good/bad not the difference between angry/sad so this is just a rough 'how good/bad does this character feel at this moment'.
    const emoji = ['🤬', '😫', '😣', '🙁', '😕', '😐', '😏', '🙂', '😀', '😃', '😆'];
    return `${emoji[emojiIndex] || emoji[5]} (${sentiment.toFixed(1)})`;
}
