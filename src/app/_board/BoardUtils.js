/*

┌───┬───┐
│   │   │
├───┼───┤
│   │   │
└───┴───┘

*/

import BoardBuilder from './BoardBuilder';

/**
 * Prints out a representation of the board to the console
 * @param {BoardBuilder} board - The board to display
 * @param {number} [gridType=0] - 0 for no grid, 1 for minimal, 2 for square
 */
export function displayBoard (board, gridType = 0) {
    switch (gridType) {
        case (GRID_TYPES.NONE):
            for (let y = 0; y < board.height; y++) {
                let line = '';

                for (let x = 0; x < board.width; x++) {
                    line += board.getShip([x, y]);
                }

                console.log(line);
            }

            break;
        case (GRID_TYPES.MINIMAL):
        case (GRID_TYPES.FULL):
            printEnd(board.width, gridType, true);

            for (let y = 0; y < board.height; y++) {
                let out = '│';

                for (let x = 0; x < board.width; x++) {
                    const ship = board.getShip([x, y]);
                    out += gridType === GRID_TYPES.MINIMAL ? `${ship}│` : ` ${ship} |`;
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
    let out = top ? '┌' : '└';

    for (let i = 0; i < width; i++) {
        out += gridType === GRID_TYPES.MINIMAL ? '─' : '───';
        out += top ? '┬' : '┴';
    }

    console.log(out.slice(0, -1) + (top ? '┐' : '┘'));
}

function printBar (width, gridType) {
    let out = '├';

    for (let i = 0; i < width; i++) {
        out += gridType === GRID_TYPES.MINIMAL ? '─┼' : '───┼';
    }

    console.log(out.slice(0, -1) + '┤');
}

/**
 * @constant
 */
export const GRID_TYPES = {
    NONE: 0,
    MINIMAL: 1,
    FULL: 2,
};
