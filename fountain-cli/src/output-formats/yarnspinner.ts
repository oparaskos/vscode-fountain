import { ActionElement, DialogueElement, FountainScript, FountainTitlePage, SceneElement, SectionElement, TransitionElement } from 'fountain-parser';
import { WriteStream, write } from 'fs';
import { FountainElement, LocationType } from 'fountain-parser';

function writeComment(comment: string, ws: WriteStream) {
    comment.split('\n').forEach(it=>ws.write(`//${it}\n`));
}

export function beginWriteScriptAsYarnspinner(script: FountainScript, ws: WriteStream) {
    // Write a preamble based on the script title page
    const attrs = script.titlePage.attributes;
    const titlePagePreamble = Object.keys(attrs)
        .map(key => ({key, value: attrs[key]}))
        .map(it => `${it.key}: ${it.value}`)
            .join('\n')
    
    const c = script.scenes[0];
    ws.write(`title: RootNode\n---\n`);
    writeComment(titlePagePreamble, ws)
    writeScriptAsYarnspinner(script, script.children, ws, {i: 0});
}


function writeScriptAsYarnspinner(script: FountainScript, children: FountainElement[], ws: WriteStream, a: {i: number}) {
    children.forEach(child => {
        let c;
        switch (child.type) {
            case 'title-page':
                return;
            case 'scene':
                c = child as SceneElement;
                if(a.i == 0) {
                    ws.write(`<<jump Scene_${a.i}_${formatSceneName(c)}>>\n===\n\n`);
                }
                writeComment(`${LocationType[c.location?.locationType || 0].substring(0,3)}. ${c.location?.name} - ${c.location?.timeOfDay}`, ws);
                ws.write(`title: Scene_${a.i}_${formatSceneName(c)}\n`);
                ws.write(`locationType: ${LocationType[c.location?.locationType || 0]}\n`);
                ws.write(`location: ${c.location?.name}\n`);
                ws.write(`timeOfDay: ${c.location?.timeOfDay}\n`);
                ws.write(`\n---\n`);
                writeScriptAsYarnspinner(script, c.children, ws, a);
                if (script.scenes.length > a.i + 1) {
                    const nextScene = script.scenes[a.i+1];
                    ws.write(`<<jump Scene_${a.i}_${formatSceneName(nextScene)}>>\n`);
                }
                ws.write(`===\n\n`);
                a.i += 1;
                break;
            case 'centered-text':
                break;
            case 'transition':
                c = child as TransitionElement;
                ws.write(`<<transition "${formatTextForCommandArgument(child)}">>`);
                break;
            case 'dialogue':
                c = child as DialogueElement;
                ws.write(`${formatCharacterName(c)}: ${c.dialogue} ${formatParenthetical(c)} ${formatExtension(c)}\n`);
                break;
            case 'dual-dialogue':
                break;
            case 'action':
                ws.write(`<<action "${formatTextForCommandArgument(child)}">>\n`);
                break;
            case 'boneyard':
                writeComment(child.textContent, ws);
                break;
            case 'notes':
                writeComment(child.textContent, ws);
                break;
            case 'lyrics':
                ws.write(`<<lyrics "${formatTextForCommandArgument(child)}">>\n`);
                break;
            case 'line-break':
                ws.write(`\n`);
                break;
            case 'page-break':
                ws.write(`\n\n// ----------\n\n`);
                break;
            case 'section':
                c = child as SectionElement;
                writeComment(`section: ${c.title}`, ws);
                writeScriptAsYarnspinner(script, c.children, ws, a);
                break;
            case 'synopses':
                writeComment(child.textContent, ws);
                break;
            default:
                break;
        }
    });
}
function formatTextForCommandArgument(child: FountainElement<import("/Users/oliverparaskos/Workspace/vscode-fountain/parser/dist/index").FountainElementType>) {
    return child.textContent.replace(/^>/, '').replace('"', '\\"').replace('\n', '\\n');
}

function formatCharacterName(c: DialogueElement) {
    const toTitleCase = (word: string) => word[0].toLocaleUpperCase() + word.toLocaleLowerCase().slice(1);
    return c.character.split(' ').map(it => toTitleCase(it)).join('');
}

function formatExtension(c: DialogueElement) {
    if(!c.extension) return '';
    if(/CONT'?D?/ig.test(c.extension)) return '';
    if(/V\.?O\.?/ig.test(c.extension)) return '#voice_over';
    if(/O\.?S\.?/ig.test(c.extension)) return '#off_screen';
    return `#ext:${c.extension?.replace(/\s/ig, '_').toLocaleLowerCase()}`;
}

function formatParenthetical(c: DialogueElement) {
    return c.parenthetical ? `#paren:${c.parenthetical.text?.replace(/\s/ig, '_').toLocaleLowerCase()}` : '';
}

function formatSceneName(c: SceneElement) {
    return c.title.toLocaleLowerCase().replace(/[^A-Z0-9\s]+/ig, '').trim().replace(/\s+/ig, '_')
}

