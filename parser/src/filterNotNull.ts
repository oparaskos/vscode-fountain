export function filterNotNull<T>(arr: (T | null)[]): T[] {
    return arr.filter(t => t !== null) as T[];
}
