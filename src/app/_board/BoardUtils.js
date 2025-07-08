/*

┌───┬───┐
│   │   │
├───┼───┤
│   │   │
└───┴───┘

*/

const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[37m';
const GRAY = '\x1b[90m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';

const BRIGHT = '\x1b[1m';
const DIM = '\x1b[2m';

import Board from './Board';
import { TYPE } from './Ship';

/**
 * Prints out a representation of the board to the console
 * @param {Board} board The board to display
 * @param {boolean} showInternal Should internal types be colored differently? (red: horizontal, yellow: vertical)
 * @param {number} [gridType] 0 for no grid, 1 for minimal, 2 for full
 */
export function displayBoard (board, showInternal, gridType = GRID_TYPES.FULL) {
    switch (gridType) {
        case (GRID_TYPES.NONE):
            for (let y = 0; y < board.height; y++) {
                let out = '';

                for (let x = 0; x < board.width; x++) {
                    const ship = board.getShip([x, y]);
                    if (ship.playType === TYPE.WATER) out += DIM + CYAN;
                    if (showInternal) {
                        if (ship.internalType === TYPE.HORIZONTAL) out += RED;
                        if (ship.internalType === TYPE.VERTICAL) out += YELLOW;
                    }
                    out += ship + RESET;
                }

                console.log(out);
            }

            break;
        case (GRID_TYPES.MINIMAL):
        case (GRID_TYPES.FULL):
            printEnd(board.width, gridType, true);

            for (let y = 0; y < board.height; y++) {
                let out = GRAY + '│' + RESET;

                for (let x = 0; x < board.width; x++) {
                    const ship = board.getShip([x, y]);
                    if (ship.playType === TYPE.WATER) out += DIM + CYAN;
                    out += BRIGHT + WHITE;
                    if (showInternal) {
                        if (ship.internalType === TYPE.HORIZONTAL) out += RED;
                        if (ship.internalType === TYPE.VERTICAL) out += YELLOW;
                    }
                    out += (gridType === GRID_TYPES.MINIMAL ? `${ship}` : ` ${ship} `);
                    out += `${GRAY}│${RESET}`;
                }

                console.log(out);

                if (y < board.height - 1) printBar(board.width, gridType);
            }

            printEnd(board.width, gridType, false);
            break;
        default:
            throw new RangeError('gridType should be an integer 0-2, received: ' + gridType);
    }
}

function printEnd (width, gridType, top) {
    let out = GRAY + (top ? '┌' : '└');

    for (let i = 0; i < width; i++) {
        out += gridType === GRID_TYPES.MINIMAL ? '─' : '───';
        out += top ? '┬' : '┴';
    }

    console.log(out.slice(0, -1) + (top ? '┐' : '┘') + RESET);
}

function printBar (width, gridType) {
    let out = GRAY + '├';

    for (let i = 0; i < width; i++) {
        out += gridType === GRID_TYPES.MINIMAL ? '─┼' : '───┼';
    }

    console.log(out.slice(0, -1) + '┤' + RESET);
}

/**
 * @readonly
 * @enum
 */
export const GRID_TYPES = Object.freeze({
    NONE: 0,
    MINIMAL: 1,
    FULL: 2,
});
