import { existsSync, readFileSync, realpathSync } from 'fs';

import { logger } from './logger';

export function readLocaleFileSync(path: string, fileName: string, locale: Intl.Locale) {
	const pathWithScriptAndRegion = `${path}/${locale.language}-${locale.script}-${locale.region}/${fileName}`;
	const pathWithRegion = `${path}/${locale.language}-${locale.region}/${fileName}`;
	const pathWithScript = `${path}/${locale.language}-${locale.script}/${fileName}`;
	const pathWithLanguageOnly = `${path}/${locale.language}/${fileName}`;
	const defaultPath = `${path}/en/${fileName}`;

	if (existsSync(pathWithScriptAndRegion)) {
		logger.log(`Reading for locale ${locale.baseName} ${pathWithScriptAndRegion}`);
		return readFileSync(realpathSync(pathWithScriptAndRegion));
	}
	if (existsSync(pathWithRegion)) {
		logger.log(`Reading language-and-region ${pathWithRegion}`);
		return readFileSync(realpathSync(pathWithRegion));
	}
	if (existsSync(pathWithScript)) {
		logger.log(`Reading language-and-script ${pathWithScript}`);
		return readFileSync(realpathSync(pathWithScript));
	}
	if (existsSync(pathWithLanguageOnly)) {
		logger.log(`Reading language-only ${pathWithLanguageOnly}`);
		return readFileSync(realpathSync(pathWithLanguageOnly));
	}
	logger.log(`Reading default ${defaultPath}`);
	return readFileSync(realpathSync(defaultPath));
}
