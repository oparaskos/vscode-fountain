import { readFile } from 'fs-extra';
import { readJSON, writeJSON } from 'fs-promise';
import {join, resolve} from 'path';
import { FountainScript, parse } from '../src';

const samplesDir = resolve(join(__dirname, '../../sample/'));
describe('Fountain Samples', () => {

    describe('Simple.fountain', () => {
        const fixturePath = join(samplesDir, 'Simple.fountain');
        let fountainScript: FountainScript = null as unknown as FountainScript;
        beforeEach(async () => {
            const fixtureContent = await readFile(fixturePath, 'utf-8');
            fountainScript = parse(fixtureContent);
        });

        it('should find all the character names', () => {
            expect(fountainScript.characterNames).toEqual(['MAN']);
        });

        it('should find all the scene names', () => {
            expect(fountainScript.scenes.map(it => it.location?.name)).toEqual(['OFFICE', 'house']);
        });

    });

    for (const sample of ['Boneyard']){//, 'CenteredText', 'Indenting', 'Notes', 'Outlining', 'PageBreaks', 'MultilineAction' // 'Dialogue', 'DualDialogue', 'ForcedElements']){
        it(`${sample} should match snapshot`, async () => {
            const path = resolve(join(samplesDir, `${sample}.fountain`));
            // await writeJSON(path + ".snapshot.json", parse(await readFile(path, 'utf-8')), {spaces:2});
            const snapshot = await readJSON(path + ".snapshot.json");
            expect(JSON.parse(JSON.stringify(parse(await readFile(path, 'utf-8'))))).toEqual(snapshot);
        });
    }
});
