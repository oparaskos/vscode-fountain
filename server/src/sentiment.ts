import { ProviderOptions, PostProcessProvider } from './TextBlockStatProvider';
import {lemmatizer as lemmatize} from "lemmatizer";
import { readLocaleFileSync } from './readLocaleFileSync';
import { FountainElement } from 'fountain-parser';
import { CharacterStats, IFountainScript } from 'fountain-parser/src/types';
import { logger } from './logger';

export interface Sentiment extends Object {
	joy: number;
	trust: number;
	fear: number;
	surprise: number;
	sadness: number;
	disgust: number;
	anger: number;
	anticipation: number;
	good?: number;
}


const ZERO_SENTIMENT = {
	joy: 0,
	trust: 0,
	fear: 0,
	surprise: 0,
	sadness: 0,
	disgust: 0,
	anger: 0,
	anticipation: 0,
	good: 0
};

function simplify_sentiment(sent: Sentiment): number {
	const base = (-sent.anger + -sent.disgust + -sent.sadness + -sent.fear + sent.joy + sent.trust);
	return base + sent.anticipation * base;
}

export abstract class SentimentProvider extends PostProcessProvider {
	constructor(opts: ProviderOptions) { super(opts, "SENTIMENT"); }
	public init() { return; }
	public analyse(_tokens: string[]): Sentiment { return ZERO_SENTIMENT; }
	public override process(node: FountainElement): void {
		const sentiment = this.analyse(node.tokens.map(t => t.text as string).filter(it => !!it));
		node.addAttribute(this.attributeName, sentiment);
	}
}

export class SimpleSentimentProvider extends SentimentProvider {

	private sentimentByWord: null | {[k: string]: Sentiment} = null;
	private wordSentimentFile = "emotions.csv";
	private assetsDirectory = `${__dirname}/../../assets/`;

	constructor(opts: ProviderOptions) { super(opts); }
	
	public override init() {
		const csvFile = readLocaleFileSync(this.assetsDirectory, this.wordSentimentFile, this.opts.locale).toString('utf-8');
		const lines = csvFile.split('\n');
		const columns = lines[0].split(',');
		this.sentimentByWord = lines.map(line => {
				const cols = line.split(',');
				return columns.reduce((acc, curr, i) => {
					acc[curr] = cols[i];
					return acc;
				}, {} as any);
			}).reduce((acc, curr) => {
				acc[lemmatize(curr.word)] = {
					joy: parseFloat(curr.joy),
					trust: parseFloat(curr.trust),
					fear: parseFloat(curr.fear),
					surprise: parseFloat(curr.surprise),
					sadness: parseFloat(curr.sadness),
					disgust: parseFloat(curr.disgust),
					anger: parseFloat(curr.anger),
					anticipation: parseFloat(curr.anticipation)
				};
				return acc;
			}, {});
	}

	public analyse(words: string[]): Sentiment {
		if(!this.sentimentByWord) throw "sentiment provider not initialised";
		const _wordMap = this.sentimentByWord;
		const wordSentiments = words
			.map(word => {
				const fullWordMatch = _wordMap[word];
				if(fullWordMatch) return fullWordMatch;
				const lemMatch = _wordMap[lemmatize(word)];
				if(lemMatch) return lemMatch;
				return ZERO_SENTIMENT; 
			});
		return this.average(wordSentiments);
	}
	public average(sentiments: Sentiment[]) {
		const result = sentiments.reduce((acc, curr) => {
			return {
				joy: acc.joy + curr.joy,
				trust: acc.trust + curr.trust,
				fear: acc.fear + curr.fear,
				surprise: acc.surprise + curr.surprise,
				sadness: acc.sadness + curr.sadness,
				disgust: acc.disgust + curr.disgust,
				anger: acc.anger + curr.anger,
				anticipation: acc.anticipation + curr.anticipation,
			} as Sentiment;
		}, ZERO_SENTIMENT);		
		const n = sentiments.length;
		const avgSentiment: Sentiment = {
			joy: result.joy / n,
			trust: result.trust / n,
			fear: result.fear / n,
			surprise: result.surprise / n,
			sadness: result.sadness / n,
			disgust: result.disgust / n,
			anger: result.anger / n,
			anticipation: result.anticipation / n,
		};
		avgSentiment.good = simplify_sentiment(avgSentiment);
		return avgSentiment;
	}
	public override statsPerCharacter(stats: CharacterStats[], script: IFountainScript): CharacterStats[] {
		logger.log("sentiment.statsPerCharacter");
		return stats.map((it) => {
			const characterDialogues = script.dialogueByCharacters[it.Name];
			const sentiments = characterDialogues.map(it => it.elementAttributes[this.attributeName] as Sentiment);
			return {
				...it,
				Sentiment: this.average(sentiments)
			};
		});
	}

	public override statsPerLocation(stats: { Name: string; Duration: number; Scenes: number; Type: string; }[], script: IFountainScript): { Name: string; Duration: number; Scenes: number; Type: string; }[] {
		logger.log("sentiment.statsPerLocation");
		return stats.map((it) => {
			const scenesByLocation = script.scenesByLocationName[it.Name];
			const sentiments = scenesByLocation.flatMap(it => it.elementAttributes[this.attributeName] as Sentiment);
			return {
				...it,
				Sentiment: this.average(sentiments)
			};
		});
	}

	public override statsPerScene(stats: { Name: string; Duration: number; Characters: string[]; Synopsis: string; DialogueDuration: number; ActionDuration: number; }[], script: IFountainScript): { Name: string; Duration: number; Characters: string[]; Synopsis: string; DialogueDuration: number; ActionDuration: number; }[] {
		return stats;//.map((it, i) => {
		// 	const sentiment = script.scenes[i].elementAttributes[this.attributeName] as Sentiment;
		// 	return {
		// 		...it,
		// 		Sentiment: sentiment
		// 	};
		// });
	}

}
