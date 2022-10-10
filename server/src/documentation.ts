import path from 'path';
import { readFile, stat } from 'fs/promises';
import { logger } from './logger';
import { Hover } from 'vscode-languageserver';

const docsFolderPath = path.normalize(path.join(__dirname, '../../documentation'));

const EMPTY_DOCS = {
	contents: ""
};
// TODO: docs cache.
export async function getDocumentation(topic: string): Promise<Hover> {
	try {
		const documentPath = path.join(docsFolderPath, `syntax.${topic}.md`);
		try {
			if ((await stat(documentPath)).isFile()) {
				return {contents: await readFile(documentPath, 'utf8')};
			}
		} catch(e) {
			logger.trace(`No doc file at ${documentPath}`);
		}
		return EMPTY_DOCS;
	} catch(e: any) {
		logger.error('Could not load documentation', e);
		return EMPTY_DOCS; // TODO:
	}
}