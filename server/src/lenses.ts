import { CodeLens, Range } from "vscode-languageserver";
import { FountainScript, DialogueElement, SceneElement} from "fountain-parser";
import { formatTime } from './util/formatTime';

export function dialogueLens(lines: string[], parsedScript: FountainScript, uri: string): CodeLens[] {
	const dialogueByCharacters: Record<string, DialogueElement[]> = parsedScript.dialogueByCharacters;
	return Object.keys(dialogueByCharacters).flatMap(characterName => {
		const dialogues = dialogueByCharacters[characterName];
		return dialogueByCharacters[characterName].map(dialogue => {
			const lineNo = dialogue.tokens?.[0]?.codeLocation?.start?.line || 0;
			return {
				range: Range.create(lineNo, 0, lineNo, lines[lineNo].length),
				data: { name: characterName, uri, lines: dialogues.length, type: 'character' }
			};
		});
	});
}


export function locationsLens(lines: string[], parsedScript: FountainScript, uri: string): CodeLens[] {
	const locationsByName: Record<string, SceneElement[]> = parsedScript.scenesByLocationName;
	return Object.keys(locationsByName).flatMap(locationName => {
		const scenes = locationsByName[locationName];
		return scenes.map(scene => {
			const lineNo = scene.tokens?.[0]?.codeLocation?.start?.line || 0;
			return {
				range: Range.create(lineNo, 0, lineNo, lines[lineNo].length),
				data: { name: locationName, uri, references: scenes.length, type: 'location' }
			};
		});
	});
}


export function scenesLens(lines: string[], parsedScript: FountainScript, uri: string): CodeLens[] {
    const scenes: SceneElement[] = parsedScript.scenes;
	return scenes.map(scene => {
		const lineNo = scene.tokens?.[0]?.codeLocation?.start?.line || 0;
		return {
			range: Range.create(lineNo, 0, lineNo, lines[lineNo].length),
			data: { name: scene.title, uri, duration: formatTime(scene.duration), type: 'scene' }
		};
	});
}


