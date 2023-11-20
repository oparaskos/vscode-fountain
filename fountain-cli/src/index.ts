import { FountainScript, parse } from 'fountain-parser';
import { readFile } from 'fs/promises';
import { program } from 'commander';
import { WriteStream } from 'fs';
import { createWriteStream } from 'fs-extra';
import { beginWriteScriptAsYarnspinner } from './output-formats/yarnspinner';

program
  .option('-i, --source <source_path>')
  .option('-o, --output <destination_path>')
  .option('-c, --charset <charset>', undefined, 'utf-8');

program.parse();

const options = program.opts();

(async() => {
    const script = await readScript();
    writeScriptToFile(script);
})();

function writeScriptToFile(script: FountainScript) {
    const ws: WriteStream = createWriteStream(options.output, { flags: 'w' });
    beginWriteScriptAsYarnspinner(script, ws);
}

async function readScript() {
    const contents = await readFile(options.source);
    const script = parse(contents.toString(options.charset));
    return script;
}


