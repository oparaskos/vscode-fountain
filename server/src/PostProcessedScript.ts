import { DialogueElement, FountainElement, parse, SceneElement } from 'fountain-parser';
import { CharacterStats, FountainScript, IFountainScript } from 'fountain-parser/src/types';
import { FountainElementWithChildren } from 'fountain-parser/src/types/FountainElementWithChildren';
import { Position } from 'fountain-parser/src/types/Position';
import { Range, ZERO_RANGE } from 'fountain-parser/src/types/Range';
import { ExampleSettings } from './ExampleSettings';
import { logger } from './logger';
import { PostProcessProvider, ProcessOrder } from './TextBlockStatProvider';

export class PostProcessedScript implements IFountainScript {
	public lines: string[] = [];
	private parsedScript: FountainScript | null = null;

	constructor(public postProcessProviders: PostProcessProvider[], public settings: ExampleSettings)	{
		logger.log(`Initialising ${postProcessProviders.length} providers...`);
		for (let i = postProcessProviders.length; i--; i >= 0) {
			const prov = postProcessProviders[i];
			logger.log(`Initialising provider ${i} for ${prov.attributeName}`);
			try {
				prov.init();
			} catch (e) {
				logger.error(`Failed to init provider for ${prov.attributeName}`);
				logger.error(e);
				postProcessProviders.splice(i, 1);
			}
		}
	}

	public async parse(text: string) {
		this.lines = text.split(/\r\n|\n\r|\n|\r/);
		// Parse the document.
		this.parsedScript = parse(text);
		for(const postProcessor of this.postProcessProviders) {
			for (const child of this.parsedScript.children) {
				await this.applyPostProcess(child, postProcessor);
			}
		}
		return this;
	}

	private async applyPostProcess(node: FountainElement, postProcessor: PostProcessProvider) {
		const promises: Promise<void>[] = [];
		if (postProcessor.mode == ProcessOrder.DEPTH_FIRST && node instanceof FountainElementWithChildren) {
			for(const child of node.children) {
				const promise = this.applyPostProcess(child, postProcessor);
				if (!postProcessor.async) await promise;
				else promises.push(promise);
			}
		}
		await Promise.all(promises);
		await postProcessor.process(node);
		if (postProcessor.mode == ProcessOrder.BREADTH_FIRST && node instanceof FountainElementWithChildren) {
			for(const child of node.children) {
				const promise = this.applyPostProcess(child, postProcessor);
				if (!postProcessor.async) await promise;
				else promises.push(promise);
			}
		}
		await Promise.all(promises);
	}
	get children(): FountainElement<string>[] {
		return this.parsedScript?.children || [];
	}
	public getElementsByPosition(position: Position): FountainElement<string>[] {
		return this.parsedScript?.getElementsByPosition(position) || [];
	}
	get characterNames(): string[] {
		return this.parsedScript?.characterNames || [];
	}
	get range(): Range {
		return this.parsedScript?.range || ZERO_RANGE;
	}
	get dialogue(): DialogueElement[] {
		return this.parsedScript?.dialogue || [];
	}
	get dialogueByCharacters(): Record<string, DialogueElement[]> {
		return this.parsedScript?.dialogueByCharacters || {};
	}
	get scenes(): SceneElement[] {
		return this.parsedScript?.scenes || [];
	}
	get locationNames(): string[] {
		return this.parsedScript?.locationNames || [];
	}
	get scenesByLocationName(): Record<string, SceneElement[]> {
		return this.parsedScript?.scenesByLocationName || {};
	}
	get statsPerCharacter(): CharacterStats[] {
		logger.log("pps.statsPerCharacter");
		let result = this.parsedScript?.statsPerCharacter || [];
		if (this.parsedScript) {
			for (const pp of this.postProcessProviders) {
				result = pp.statsPerCharacter(result, this.parsedScript);
			}
		}
		return result;
	}
	get statsPerScene(): { Name: string; Duration: number; Characters: string[]; Synopsis: string; DialogueDuration: number; ActionDuration: number; }[] {
		logger.log("pps.statsPerScene");
		let result = this.parsedScript?.statsPerScene || [];
		if (this.parsedScript) {
			for (const pp of this.postProcessProviders) {
				result = pp.statsPerScene(result, this.parsedScript);
			}
		}
		return result;
	}
	get statsPerLocation(): { Name: string; Duration: number; Scenes: number; Type: string; }[] {
		logger.log("pps.statsPerLocation");
		let result = this.parsedScript?.statsPerLocation || [];
		if (this.parsedScript) {
			for (const pp of this.postProcessProviders) {
				result = pp.statsPerLocation(result, this.parsedScript);
			}
		}
		return result;
	}
}