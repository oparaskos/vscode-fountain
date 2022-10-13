import * as assert from 'assert';
import { tokenize } from '../tokenize';
import { FountainToken, FountainTokenType } from '../types/FountainTokenType';
import {suite, test} from 'mocha';

suite('Tokenizer', () => {
	([['@', 'character'], ['!', 'action'], ['.', 'scene_heading'], ['>', 'transition']] as [string, FountainTokenType][])
		.map(([prefix, expected_type]) => {
			test(`should tokenize ${expected_type} elements forced with ${prefix}`, async () => {
				expectTokens(`${prefix}blah`, [{ type: expected_type }]);
			});
		});
});

function expectTokens(script: string, expected: Partial<FountainToken>[]) {
	const tokens = tokenize(script);
	assert.equal(tokens.length, expected.length);
	for(const i in tokens) {
		if(expected[i].codeLocation) assert.deepEqual(tokens[i].codeLocation, expected[i].codeLocation);
		if(expected[i].depth) assert.deepEqual(tokens[i].depth, expected[i].depth);
		if(expected[i].dual) assert.deepEqual(tokens[i].dual, expected[i].dual);
		if(expected[i].key) assert.deepEqual(tokens[i].key, expected[i].key);
		if(expected[i].line) assert.deepEqual(tokens[i].line, expected[i].line);
		if(expected[i].scene_number) assert.deepEqual(tokens[i].scene_number, expected[i].scene_number);
		if(expected[i].text) assert.deepEqual(tokens[i].text, expected[i].text);
		if(expected[i].type) assert.deepEqual(tokens[i].type, expected[i].type);
	}
}