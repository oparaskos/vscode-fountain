import { CodeLens, Range } from "vscode-languageserver";
import { FountainScript } from "./parser/types";

export function dialogueLens(lines: string[], parsedScript: FountainScript, uri: string): CodeLens[] {
	const dialogueByCharacters = parsedScript.dialogueByCharacters;
	return Object.keys(dialogueByCharacters).flatMap(characterName => {
		const dialogues = dialogueByCharacters[characterName];
		return dialogueByCharacters[characterName].map(dialogue => {
			const lineNo = dialogue.tokens[0].codeLocation.start.line;
			return {
				range: Range.create(lineNo, 0, lineNo, lines[lineNo].length),
				data: { name: characterName, uri, lines: dialogues.length, type: 'character' }
			};
		});
	});
}


export function locationsLens(lines: string[], parsedScript: FountainScript, uri: string): CodeLens[] {
	const locationsByName = parsedScript.scenesByLocationName;
	return Object.keys(locationsByName).flatMap(locationName => {
		const scenes = locationsByName[locationName];
		return scenes.map(scene => {
			const lineNo = scene.tokens[0].codeLocation.start.line;
			return {
				range: Range.create(lineNo, 0, lineNo, lines[lineNo].length),
				data: { name: locationName, uri, references: scenes.length, type: 'location' }
			};
		});
	});
}


export function scenesLens(lines: string[], parsedScript: FountainScript, uri: string): CodeLens[] {
	return parsedScript.scenes.map(scene => {
		const lineNo = scene.tokens[0].codeLocation.start.line;
		return {
			range: Range.create(lineNo, 0, lineNo, lines[lineNo].length),
			data: { name: scene.title, uri, duration: formatTime(scene.duration), type: 'scene' }
		};
	});
}

export function formatTime(seconds: number) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.round(seconds % 60);
	return [
		h,
		m > 9 ? m : (h ? '0' + m : m || '0'),
		s > 9 ? s : '0' + s
	].filter(Boolean).join(':');
}
