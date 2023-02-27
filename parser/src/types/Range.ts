import { Position } from './Position';

/**
 * A range in a text document expressed as (zero-based) start and end positions.
 *
 * If you want to specify a range that contains a line including the line ending
 * character(s) then use an end position denoting the start of the next line.
 * For example:
 * ```ts
 * {
 *     start: { line: 5, character: 23 }
 *     end : { line 6, character : 0 }
 * }
 * ```
 */
export interface Range {
    /**
     * The range's start position
     */
    start: Position;
    /**
     * The range's end position.
     */
    end: Position;
}

export const ZERO_RANGE: Range =
{
    start: { line: 0, character: 0 },
    end: { line: 0, character: 0 }
};