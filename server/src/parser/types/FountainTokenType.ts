export interface SourceMapElement {
    file: string;
    start: CodeLocation;
    end: CodeLocation;
}

export interface CodeLocation {
    line: number;
    column: number;
    index: number;
}

export type FountainTokenType = 
'title_page_property' |
'scene_heading' |
'centered' |
'transition' |
'dual_dialogue_end' |
'dual_dialogue_begin' |
'dialogue_end' |
'dialogue_begin' |
'action' |
'note_begin' |
'note_end' |
'note' |
'line_break' |
'page_break' |
'emphasis' |
'bold_italic_underline' |
'bold_underline' |
'italic_underline' |
'bold_italic' |
'bold' |
'italic' |
'underline' |
'parenthetical' |
'section' |
'synopsis' |
'note_inline' |
'boneyard' |
'title_page' |
'scene_number' |
'dialogue' |
'character' |
'boneyard_begin' |
'boneyard_end' |
'end_title_page';
export interface FountainToken {
    type: FountainTokenType;
    text?: string;
    scene_number?: string;
    depth?: number;
    dual?: 'left' |
'right';
    key?: string;
    line: string;
    codeLocation: SourceMapElement;
}
