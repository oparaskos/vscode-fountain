// import * as assert from 'assert';
// import { suite, test } from 'mocha';
// import { readFile } from 'fs/promises';
// import path, { basename } from 'path';

// const EMOTIONS = {
// 	ANGER: {name: "anger", min: 33, max: 66},
// 	// ANTICIPATION = 0b10,
// 	// DISGUST = 0b100,
// 	// FEAR = 0b1000,
// 	// JOY = 0b10000,
// 	// SADNESS = 0b100000,
// 	// SURPRISE = 0b1000000,
// 	// TRUST = 0b10000000
// };

// import { sentiment, init as sentimentInit, Sentiment } from '../sentiment';
// suite('Emotion', () => {
// 	before(() => sentimentInit());

// 	const cases: [string, EMOTIONS[]][] = [
// 		["I love you!", [EMOTIONS.ANTICIPATION, EMOTIONS.JOY, EMOTIONS.TRUST]],
// 		["you have my trust", [EMOTIONS.TRUST]]
// 	];
	
// 	cases.forEach(([sentence, expected]) => 
// 		test(`"${sentence}"`, async () => {
// 			const s = sentiment(sentence);
// 			assertSentiment(s, expected, true);
// 		}));
// });

// function assertSentiment(s: Sentiment, e: EMOTIONS[], exclusive = false, min = 10) {
// 	if(e.includes(EMOTIONS.ANGER)) assert.ok(s.anger > min, `ANGER should be > ${min}`);else if (exclusive) assert.ok(s.anger <= min, `anger should be <= ${min}`);
// 	if(e.includes(EMOTIONS.ANTICIPATION)) assert.ok(s.anticipation > min, `ANTICIPATION should be > ${min}`); else if (exclusive) assert.ok(s.anticipation <= min, `anticipation should be <= ${min}`);
// 	if(e.includes(EMOTIONS.DISGUST)) assert.ok(s.disgust > min, `DISGUST should be > ${min}`); else if (exclusive) assert.ok(s.disgust <= min, `disgust should be <= ${min}`);
// 	if(e.includes(EMOTIONS.FEAR)) assert.ok(s.fear > min, `FEAR should be > ${min}`); else if (exclusive) assert.ok(s.fear <= min, `fear should be <= ${min}`);
// 	if(e.includes(EMOTIONS.JOY)) assert.ok(s.joy > min, `JOY should be > ${min}`); else if (exclusive) assert.ok(s.joy <= min, `joy should be <= ${min}`);
// 	if(e.includes(EMOTIONS.SADNESS)) assert.ok(s.sadness > min, `SADNESS should be > ${min}`); else if (exclusive) assert.ok(s.sadness <= min, `sadness should be <= ${min}`);
// 	if(e.includes(EMOTIONS.SURPRISE)) assert.ok(s.surprise > min, `SURPRISE should be > ${min}`); else if (exclusive) assert.ok(s.surprise <= min, `surprise should be <= ${min}`);
// 	if(e.includes(EMOTIONS.TRUST)) assert.ok(s.trust > min, `TRUST should be > ${min}`); else if (exclusive) assert.ok(s.trust <= min, `trust should be <= ${min}`);
// }
