import { readFile, stat } from 'fs/promises';
import path from 'path';
import {URI } from 'vscode-uri';
import YAML from "yaml";

const EMPTY_CONFIG = {};
// TODO: config cache.
export async function getConfig(documentUri: string) {
	const documentPath = URI.parse(documentUri).fsPath;
	const documentFolder = path.dirname(documentPath);
	const pathParts = path.normalize(documentFolder).split(path.sep);
	while (pathParts.length > 0) {
		const fountainrcPath = path.join('/', ...pathParts, '.fountainrc');
		if ((await stat(fountainrcPath)).isFile()) {
			const file = await readFile(fountainrcPath, 'utf8');
			return YAML.parse(file);
		}
		pathParts.pop();
	}
	return EMPTY_CONFIG;
}