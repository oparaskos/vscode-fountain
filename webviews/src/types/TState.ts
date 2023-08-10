import { CharacterStats } from './CharacterStats';
import { LocationsStats } from './LocationsStats';
import { ScenesStats } from './ScenesStats';


export type TState = {
    statistics: {
        characters: CharacterStats[];
        locations: LocationsStats[];
        scenes: ScenesStats[];
    };
    uri: string;
};
