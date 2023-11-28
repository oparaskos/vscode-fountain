
declare module 'true-case' {
    export interface Opts {
        language?: string;
        trueCasing?: boolean;
    }
    export function titleCase(str: string, options?: Opts): string;
    export function sentenceCase(str: string, options?: Opts): string;
    export function trueCase(str: string, options?: Opts): string;
} 
