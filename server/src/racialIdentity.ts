export interface RacialIdentityConfig {
	locale: string;
	characters: {[characterName: string]: {
		'racial identity': string | undefined;
	}} | undefined;
}

// no real way to guess race based on character name or anything else that exists in the script so just look in the .fountainrc file os use 'unknown'
export function findRacialIdentity(rawName: string, config: RacialIdentityConfig) {
	if (config?.characters?.[rawName]?.['racial identity']) return (config.characters[rawName]?.['racial identity'] as string).toLowerCase();
	return 'unknown';
}


