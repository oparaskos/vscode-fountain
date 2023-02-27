import { FountainElement } from 'fountain-parser';
import { CharacterStats, IFountainScript } from 'fountain-parser/src/types';

export enum ProcessOrder {
	DEPTH_FIRST,
	BREADTH_FIRST
}


export interface ProviderOptions {
	locale: Intl.Locale;
	fountainrc: any;
}

export abstract class PostProcessProvider {
	public mode: ProcessOrder = ProcessOrder.DEPTH_FIRST;
	public async = true;
	constructor(protected opts: ProviderOptions, public attributeName : string) {}
	public init() { return; }
	public process(_node: FountainElement): void { return; }

	public statsPerCharacter(stats: CharacterStats[], script: IFountainScript): CharacterStats[] {
		return stats;
	}
	public statsPerScene(stats: { Name: string; Duration: number; Characters: string[]; Synopsis: string; DialogueDuration: number; ActionDuration: number; }[], script: IFountainScript): { Name: string; Duration: number; Characters: string[]; Synopsis: string; DialogueDuration: number; ActionDuration: number; }[] {
		return stats;
	}
	public statsPerLocation(stats: { Name: string; Duration: number; Scenes: number; Type: string; }[], script: IFountainScript): { Name: string; Duration: number; Scenes: number; Type: string; }[] {
		return stats;
	}
}
