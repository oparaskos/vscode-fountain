import * as assert from 'assert';
import { tokenize } from '../tokenize';
import { FountainToken, FountainTokenType } from '../types/FountainTokenType';
import { suite, test } from 'mocha';
import { readFile } from 'fs/promises';
import path, { basename } from 'path';

const sampleDir = path.join(__dirname, '../../../sample');
const fixtures = [
	'Boneyard.fountain',
	'CenteredText.fountain'
].map(it => [
	path.join(sampleDir, it),
	path.join(sampleDir, 'tokenize', `${it}.json`)
]);

suite('Tokenizer', () => {
	([['@', 'character'], ['!', 'action'], ['.', 'scene_heading'], ['>', 'transition']] as [string, FountainTokenType][])
		.map(([prefix, expected_type]) => {
			test(`should tokenize ${expected_type} elements forced with ${prefix}`, async () => {
				expectScriptToTokenizeAs({
					script: `${prefix}blah`,
					expected: [{ type: expected_type }]
				});
			});
		});

	fixtures.map(it => {
		test(`should tokenize ${basename(it[0])} correctly`, async () => {
			const [script, expected] = await Promise.all([readFile(it[0]), readFile(it[1])]);
			expectScriptToTokenizeAs({
				script: script.toString('utf-8'),
				expected: JSON.parse(expected.toString('utf-8')) as Partial<FountainToken>[]
			});
		});
	});
});

function expectScriptToTokenizeAs({ script, expected }: { script: string; expected: Partial<FountainToken>[]; }) {
	const tokens = tokenize(script);
	const newExpected: Partial<FountainToken>[] = [];
	try {
		// We're only checking for certain properties so fill in the rest to make for a tidier diff.
		for(const i in expected) {
			newExpected[i] = {...tokens[i], ...expected[i]};
		}
		for(const i in expected) {
			if(expected[i].codeLocation) assert.deepEqual(tokens[i].codeLocation, expected[i].codeLocation);
			if(expected[i].depth) assert.deepEqual(tokens[i].depth, expected[i].depth);
			if(expected[i].dual) assert.deepEqual(tokens[i].dual, expected[i].dual);
			if(expected[i].key) assert.deepEqual(tokens[i].key, expected[i].key);
			if(expected[i].line) assert.deepEqual(tokens[i].line, expected[i].line);
			if(expected[i].scene_number) assert.deepEqual(tokens[i].scene_number, expected[i].scene_number);
			if(expected[i].text) assert.deepEqual(tokens[i].text, expected[i].text);
			if(expected[i].type) assert.deepEqual(tokens[i].type, expected[i].type);
		}
		assert.equal(tokens.length, expected.length);
	} catch (e: unknown) {
		const e2 = new assert.AssertionError({ message: "Expected script to match given tokens", actual: tokens, expected: newExpected });
		if(e instanceof Error) {
			e2.stack = e.stack;
			e2.message = e2.message + '\n' + e.message;
		} else {
			e2.message = e2.message + '\n' + e;
		}
		throw e2;
	}
}