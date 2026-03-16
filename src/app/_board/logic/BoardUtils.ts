/*

┌────┬────┐
│    │    │
├────┼────┤
│    │    │
└────┴────┘

*/

const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[37m';
const GRAY = '\x1b[90m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';

const BRIGHT = '\x1b[1m';
const DIM = '\x1b[2m';

import type Board from './Board';
import { TYPES } from './Ship';

/**
 * Prints out a representation of the board to the console
 * @param showInternal Should internal types be colored differently? (red: horizontal, yellow: vertical)
 */
export function displayBoard (board: Board, showInternal = true, gridType: GridType = GRID_TYPES.FULL): void {
    console.log(boardToString(board, showInternal, gridType));
}

/**
 * @param showInternal Should internal types be colored differently? (red: horizontal, yellow: vertical)
 */
export function boardToString (board: Board, showInternal = true, gridType: GridType = GRID_TYPES.FULL): string {
    let final = '';
    switch (gridType) {
        case (GRID_TYPES.NONE):
            for (let y = 0; y < board.height; y++) {
                let out = '';

                for (let x = 0; x < board.width; x++) {
                    const ship = board.getShip([x, y]);
                    if (ship.playType === TYPES.WATER) out += DIM + CYAN;
                    if (showInternal) {
                        if (ship.internalType === TYPES.HORIZONTAL) out += RED;
                        if (ship.internalType === TYPES.VERTICAL) out += YELLOW;
                    }
                    out += ship + RESET;
                }

                final += out + '\n';
            }

            return final;
        case (GRID_TYPES.MINIMAL):
        case (GRID_TYPES.FULL):
            final = endString(board.width, gridType, true);

            for (let y = 0; y < board.height; y++) {
                let out = GRAY + '│' + RESET;

                for (let x = 0; x < board.width; x++) {
                    const ship = board.getShip([x, y]);

                    if (ship.playType === TYPES.WATER) out += DIM + CYAN;
                    out += BRIGHT + WHITE;

                    if (showInternal) {
                        if (ship.internalType === TYPES.HORIZONTAL) out += RED;
                        if (ship.internalType === TYPES.VERTICAL) out += YELLOW;
                    }

                    out += (gridType === GRID_TYPES.MINIMAL ? `${ship}` : ` ${ship}  `);
                    out += `${RESET}${GRAY}│${RESET}`;
                }

                final += out + '\n';

                if (y < board.height - 1) final += barString(board.width, gridType);
            }

            return final + endString(board.width, gridType, false);
        default:
            throw new RangeError('gridType should be an integer 0-2, received: ' + gridType);
    }
}

function endString (width: number, gridType: GridType, top: boolean): string {
    let out = GRAY + (top ? '┌' : '└');

    for (let i = 0; i < width; i++) {
        out += gridType === GRID_TYPES.MINIMAL ? '─' : '────';
        out += top ? '┬' : '┴';
    }

    return out.slice(0, -1) + (top ? '┐' : '┘') + RESET + '\n';
}

function barString (width: number, gridType: GridType): string {
    let out = GRAY + '├';

    for (let i = 0; i < width; i++) {
        out += gridType === GRID_TYPES.MINIMAL ? '─┼' : '────┼';
    }

    return out.slice(0, -1) + '┤' + RESET + '\n';
}

export const GRID_TYPES = {
    NONE: 0,
    MINIMAL: 1,
    FULL: 2,
} as const;

type GridType = typeof GRID_TYPES[keyof typeof GRID_TYPES];
