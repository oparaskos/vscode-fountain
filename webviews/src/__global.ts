import { VSCode } from './vscode';

declare global {
    interface Window { __vscode__: VSCode | null; __vscode_local_state__: Record<string, unknown>; }
}
