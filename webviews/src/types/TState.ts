import { CharacterStats } from './CharacterStats';
import { LocationsStats } from './LocationsStats';
import { ScenesStats } from './ScenesStats';
import { SummaryStats } from './SummaryStats';

export interface Statistics {
    characters: CharacterStats[];
    locations: LocationsStats[];
    scenes: ScenesStats[];
    document: SummaryStats;
}

export type TState = {
    statistics: Statistics;
    uri: string;
};
