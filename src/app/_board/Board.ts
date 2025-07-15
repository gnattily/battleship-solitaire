import { boardToString } from './BoardUtils';
import Ship, { TYPE } from './Ship';
import type { AnyType } from './Ship';

/**
 * The underlying Board class. For use as a preset, supply width and height. For use as a puzzle, supply preset, counts, and runs.
 * @param {...any} args All arguments
 */
export default class Board {
    width: number;
    height: number;
    colCounts: number[];
    rowCounts: number[];
    runs: number[];
    preset: Board | undefined;
    state: Ship[];

    constructor (width: number, height: number);
    constructor (width: number, height: number, colCounts: number[], rowCounts: number[], runs: number[]);
    constructor (preset: Board | string);
    constructor (preset: Board | string, colCounts: number[], rowCounts: number[], runs: number[]);
    constructor (...args:
        | [number, number]
        | [number, number, number[], number[], number[]]
        | [Board | string]
        | [Board | string, number[], number[], number[]]
    ) {
        if (typeof args[0] === 'number' && typeof args[1] === 'number') {
            const [width, height, colCounts, rowCounts, runs] = args;

            if (!Number.isInteger(height) || !Number.isInteger(width)) {
                throw new TypeError(`Expected width and height to be integers, got ${width} and ${height}`);
            }

            this.width = width;
            this.height = height;
            this.colCounts = colCounts || [];
            this.rowCounts = rowCounts || [];
            this.runs = runs || [];
            this.state = createState(this.width, this.height);
        } else if (
            (args[0] instanceof Board || typeof args[0] === 'string')
            && typeof args[1] !== 'number') {
            let preset = args[0];
            const [, colCounts, rowCounts, runs] = args;

            if (typeof preset === 'string') preset = Board.from(preset);

            this.preset = preset;
            this.width = preset.width;
            this.height = preset.height;
            this.colCounts = colCounts || [];
            this.rowCounts = rowCounts || [];
            this.runs = runs || [];
            this.state = createState(this.width, this.height, preset);
        } else {
            throw new TypeError('Types of arguments incorrect');
        }
    }

    toString (): string {
        return boardToString(this);
    }

    /**
     * Converts the board to its base64 representation
     * If the board has no counts or runs, they will be exported as 0
     */
    export (): string {
        let out = '';

        out += (this.width - 1).toString(2).padStart(8, '0');
        out += (this.height - 1).toString(2).padStart(8, '0');

        const colCounts = this.colCounts?.length === this.width ? this.colCounts : Array(this.width).fill(0);
        for (let i = 0; i < this.width; i++) {
            out += colCounts[i].toString(2).padStart(Math.ceil(Math.log2(this.width)) + 1, '0');
        }

        const rowCounts = this.rowCounts?.length === this.height ? this.rowCounts : Array(this.height).fill(0);
        for (let i = 0; i < this.height; i++) {
            out += rowCounts[i].toString(2).padStart(Math.ceil(Math.log2(this.height)) + 1, '0');
        }

        let runsBytes = '';
        const runs = this.runs || [0];
        const runBuffer = Math.max(Math.ceil(Math.log2(this.width)), Math.ceil(Math.log2(this.height)) + 1);
        runs.forEach((count, size) => {
            runsBytes += size.toString(2).padStart(runBuffer, '0');
            runsBytes += count.toString(2).padStart(runBuffer, '0');
        });

        out += runs.length.toString(2).padStart(8, '0');
        out += runsBytes;

        let currentUnknowns = 0;
        let currentWaters = 0;

        const maxLength = Math.ceil(Math.log2(this.width * this.height + 1));
        function addMultipleShips (): void {
            if (currentUnknowns * 5 > 5 + maxLength) {
                out += '11111';
                out += (currentUnknowns - 1).toString(2).padStart(maxLength, '0');
            } else if (currentUnknowns > 0) {
                for (let j = 0; j < currentUnknowns; j++) {
                    out += '00000';
                }
            } else if (currentWaters * 5 > 5 + maxLength) {
                out += '11110';
                out += (currentWaters - 1).toString(2).padStart(maxLength, '0');
            } else {
                for (let j = 0; j < currentWaters; j++) {
                    out += '00001';
                }
            }
        }

        for (let i = 0; i < this.width * this.height; i++) {
            if (currentUnknowns !== 0 || currentWaters !== 0) {
                addMultipleShips();
                currentUnknowns = 0;
                currentWaters = 0;
            }

            if (this.state[i].playType === TYPE.UNKNOWN) {
                currentUnknowns++;
                continue;
            } else if (this.state[i].playType === TYPE.WATER) {
                currentWaters++;
                continue;
            }

            out += this.state[i].pinned ? '1' : '0';
            out += this.state[i].internalType.toString(2).padStart(4, '0');
        }

        addMultipleShips();

        const paddedString = out.length % 8 === 0 ? out : out + '0'.repeat(8 - (out.length % 8));

        const byteArray = [];
        for (let i = 0; i < out.length; i += 8) {
            byteArray.push(parseInt(paddedString.slice(i, i + 8), 2));
        }

        return btoa(String.fromCharCode(...byteArray));
    }

    /**
     * Converts a base64 board to its Board object counterpart
     */
    static from (base64: string): Board {
        const string = atob(base64);

        let binaryString = '';
        for (let i = 0; i < string.length; i++) {
            binaryString += string.charCodeAt(i).toString(2).padStart(8, '0');
        }

        function trim (length: number): void {
            binaryString = binaryString.slice(length);
        }

        const width = parseInt(binaryString.slice(0, 8), 2) + 1;
        const height = parseInt(binaryString.slice(8, 16), 2) + 1;

        trim(16);

        const colCounts = [];
        for (let i = 0; i < width; i++) {
            colCounts.push(parseInt(binaryString.slice(0, Math.ceil(Math.log2(width)) + 1), 2));
            trim(Math.ceil(Math.log2(width)) + 1);
        }

        const rowCounts = [];
        for (let i = 0; i < height; i++) {
            rowCounts.push(parseInt(binaryString.slice(0, Math.ceil(Math.log2(height)) + 1), 2));
            trim(Math.ceil(Math.log2(height)) + 1);
        }

        const runBits = Math.max(Math.ceil(Math.log2(width)), Math.ceil(Math.log2(height)) + 1);
        const runEntries = parseInt(binaryString.slice(0, 8), 2);
        trim(8);

        const runs = [];
        for (let i = 0; i < runEntries; i++) {
            const size = parseInt(binaryString.slice(0, runBits), 2);
            trim(runBits);
            const count = parseInt(binaryString.slice(0, runBits), 2);
            trim(runBits);

            runs[size] = count;
        }

        const state = [];
        let i = 0;
        while (i < width * height && binaryString.length >= 5) {
            const bits = binaryString.slice(0, 5);
            const pinned = binaryString.slice(0, 1) === '1';
            const type = parseInt(binaryString.slice(1, 5), 2);

            if (type < TYPE.UNKNOWN || type > TYPE.HORIZONTAL) {
                throw new Error('Bad input. Expected type to be a type, got ' + type);
            }

            trim(5);

            const maxLength = Math.ceil(Math.log2(width * height + 1));

            if (bits === '11111' || bits === '11110') {
                const repeats = parseInt(binaryString.slice(0, maxLength), 2) + 1;
                trim(maxLength);

                for (let j = 0; j < repeats; j++) {
                    state.push(new Ship(bits === '11111' ? TYPE.UNKNOWN : TYPE.WATER));
                    i++;
                }
            } else {
                state.push(new Ship(type as AnyType, pinned));
            }
        }

        const board = new Board(width, height, colCounts, rowCounts, runs);
        board.state = state;

        return board;
    }

    /**
     * Resets the board
     */
    reset (): this {
        this.state = createState(this.width, this.height, this.preset);
        return this;
    }

    /**
     * Copies the board without pointing to the origial
     */
    copy (): Board {
        if (this.colCounts && this.rowCounts && this.runs) return new Board(this, this.colCounts, this.rowCounts, this.runs);
        else return new Board(this);
    }

    /**
     * Compares the states of two boards
     */
    sameState (comparate: Board): boolean {
        if (!(comparate instanceof Board) || this.height !== comparate.height || this.width !== comparate.width) return false;

        for (let i = 0; i < this.width * this.height - 1; i++) {
            const ship = this.getShip(i);
            const comparateShip = comparate.getShip(i);

            if (!ship.equals(comparateShip)) return false;
        }

        return true;
    }

    /**
     * Solves the board
     */
    static solve (board: Board, iterationLimit = 50): Board {
        board = board.copy();
        board.compTypes();

        for (let i = 0; i < iterationLimit; i++) {
            const old = board.copy();

            for (let y = 0; y < board.height; y++) {
                const counts = board.countRow(y);
                const expected = board.rowCounts[y];
                if (counts[0] === expected) board.softFloodRow(y);
                if (counts[0] + counts[1] === expected) board.softFloodRow(y, TYPE.SHIP);
            }

            for (let x = 0; x < board.width; x++) {
                const counts = board.countCol(x);
                const expected = board.colCounts[x];
                if (counts[0] === expected) board.softFloodCol(x);
                if (counts[0] + counts[1] === expected) board.softFloodCol(x, TYPE.SHIP);
            }

            // place water/ships around ships

            for (let i = 0; i < board.state.length; i++) {
                const square = board.getShip(i);

                if (square.playType !== TYPE.SHIP) continue;

                if (square.isCardinal()) board.setCarShips(i, Ship.typeToRelPos(square.internalType));
                else if (square.graphicalType === TYPE.SINGLE)
                    board.setCarShips(i); // makes every surrounding square water
                else if (square.internalType > TYPE.ORTHOGONAL) board.setOrthoShips(i, square.internalType as typeof TYPE.HORIZONTAL | typeof TYPE.VERTICAL);
                else board.floodCorners(i);
            }

            if (old.sameState(board)) {
                const shipsLeft = board.countRunsLeft(true);
                const horizontalRuns = board.getHorRuns();
                const verticalRuns = board.getVertRuns();

                /**
                 * Counts possibilities and adds them to a list
                 */
                function countPossibilities (run: Run, horizontal: boolean, i: number): [number[], number] {
                    const possibilities = [];
                    let totalPossibilities = 0;

                    for (let j = 0; j + i <= run.length; j++) {
                        const tmpBoard = board.copy();
                        let changed = false;

                        for (let k = 0; k < i; k++) {
                            if (tmpBoard.softSetShip(run[k + j], TYPE.SHIP)) changed = true;
                        }

                        if (!changed) continue;

                        // check if row ships > it's supposed to be
                        if (horizontal) {
                            const y = tmpBoard.indToCoord(run[0])[1];
                            const numShips = tmpBoard.countRow(y)[0];
                            if (numShips > tmpBoard.rowCounts[y]) continue;
                        } else {
                            const x = tmpBoard.indToCoord(run[0])[0];
                            const numShips = tmpBoard.countCol(x)[0];

                            if (numShips > tmpBoard.colCounts[x]) continue;
                        }

                        // check the ends of the run to see if it's really i long
                        if (tmpBoard.getRelShip(run[0], horizontal ? REL_POS.LEFT : REL_POS.TOP)?.playType === TYPE.SHIP) continue;
                        if (tmpBoard.getRelShip(run[run.length - 1], horizontal ? REL_POS.RIGHT : REL_POS.BOTTOM)?.playType === TYPE.SHIP) continue;

                        for (let k = 0; k < run.length; k++) {
                            if (possibilities[run[k + j]]) {
                                possibilities[run[k + j]]++;
                            } else {
                                possibilities[run[k + j]] = 1;
                            }
                        }

                        totalPossibilities++;
                    }

                    return [possibilities, totalPossibilities];
                }

                // loop through each length of ship
                for (let i = shipsLeft.length; i > 1; i--) {
                    const shipCount = shipsLeft[i - 1];

                    if (shipCount <= 0) continue;

                    const filteredHRuns = horizontalRuns.filter(run => run.length >= i);
                    const filteredVRuns = verticalRuns.filter(run => run.length >= i);

                    if (filteredHRuns.length === 0 && filteredVRuns.length === 0) continue;

                    const possibilities: number[] = [];
                    let totalPossibilities = 0;

                    function count (run: Run, horizontal = false): void {
                        const [poss, totalPoss] = countPossibilities(run, horizontal, i);
                        poss.forEach((val, ind) => possibilities[ind] = (possibilities[ind] ?? 0) + val);
                        totalPossibilities += totalPoss;
                    }

                    filteredHRuns.forEach(run => count(run, true));
                    filteredVRuns.forEach(run => count(run, false));

                    let set = false;

                    for (const ind in possibilities) {
                        if (possibilities[ind] === totalPossibilities) {
                            set = board.softSetShip(Number(ind), TYPE.SHIP) || set;
                        }
                    }

                    if (set) break;
                }
            }

            board.compTypes();

            if (board.sameState(old)) return board;
            if (board.isSolved()) return board;
        }

        return board;
    }

    /**
     * Checks if the board is solved
     */
    isSolved (): boolean {
        for (const square of this.state) {
            if (square.playType === TYPE.UNKNOWN) return false;
        }

        for (let x = 0; x < this.width; x++) {
            const counts = this.countCol(x);
            if (counts[0] !== this.colCounts[x]) return false;
        }

        for (let y = 0; y < this.height; y++) {
            const counts = this.countRow(y);
            if (counts[0] !== this.rowCounts[y]) return false;
        }

        const runsLeft = this.countRunsLeft(false);
        for (const count of runsLeft) {
            if (count !== 0) return false;
        }

        return true;
    }

    /**
     * Count unknown and ship squares in a column
     * @returns [#ships, #unknown]
     * @throws If x is outside of the board
     */
    countCol (x: number): [number, number] {
        if (x > this.width - 1 || x < 0) throw new RangeError(`x (${x}) is outside of the board (min: 0, max: ${this.width - 1})`);

        const counts: [number, number] = [0, 0];

        for (let y = 0; y < this.height; y++) {
            const type = this.getShip([x, y]).playType;

            if (type === TYPE.SHIP) counts[0]++;
            if (type === TYPE.UNKNOWN) counts[1]++;
        }

        return counts;
    }

    /**
     * Count unknown and ship squares in a row
     * @returns [#ships, #unknown]
     * @throws If y is outside of the board
     */
    countRow (y: number): [number, number] {
        if (y > this.height - 1 || y < 0) throw new RangeError(`y (${y}) is outside of the board (min: 0, max: ${this.height - 1})`);

        const counts: [number, number] = [0, 0];

        for (let x = 0; x < this.width; x++) {
            const type = this.getShip([x, y]).playType;

            if (type === TYPE.SHIP) counts[0]++;
            if (type === TYPE.UNKNOWN) counts[1]++;
        }

        return counts;
    }

    /**
     * Counts which runs are left
     * @param onlyCountComplete Only count runs that start and end with an end ship (eg. up, down, left, right). Defaults to false
     * @returns The number of each type of ship left (eg. 3 solos and 1 double = [3, 1])
     */
    countRunsLeft (onlyCountComplete = false): number[] {
        if (!this.runs) return [];

        const lengths = this.getRuns(onlyCountComplete).map(run => run.length);
        const currentRuns: number[] = [];

        lengths.forEach(length => {
            const i = length - 1;
            currentRuns[i] = (currentRuns[i] || 0) + 1;
        });

        // a .map function doesnt work here since there are holes
        const runsLeft = [];
        for (let i = 0; i < Math.max(currentRuns.length, this.runs.length); i++) {
            runsLeft[i] = (this.runs[i] || 0) - (currentRuns[i] || 0);
        }

        return runsLeft;
    }

    /**
     * Gets the number, length, and position of all remaining runs.
     * @param onlyCountComplete Only count runs that start and end with an end ship (eg. up, down, left, right). Defaults to false
     */
    getRuns (onlyCountComplete = false): Run[] {
        let horizontalRuns = this.getHorRuns(onlyCountComplete, true, true);
        let verticalRuns = this.getVertRuns(onlyCountComplete, true, true);

        const singleRuns: Run[] = [];

        // distinguish snippets of vertical runs from solo ships
        horizontalRuns = horizontalRuns.filter(run => {
            if (run.length === 1 && this.getRelShip(run[0], REL_POS.TOP)?.playType !== TYPE.SHIP && this.getRelShip(run[0], REL_POS.BOTTOM)?.playType !== TYPE.SHIP) singleRuns.push(run);
            return run.length !== 1;
        });

        // distinguish snippets of horizontal runs from solo ships
        verticalRuns = verticalRuns.filter(run => {
            if (run.length === 1 && this.getRelShip(run[0], REL_POS.LEFT)?.playType !== TYPE.SHIP && this.getRelShip(run[0], REL_POS.RIGHT)?.playType !== TYPE.SHIP) singleRuns.push(run);
            return run.length > 1;
        });

        const filteredSingleRuns: Run[] = [];

        // filter singleRuns for duplicates
        singleRuns.forEach(run => {
            if (onlyCountComplete && this.getShip(run[0]).graphicalType !== TYPE.SINGLE) return;

            let duplicate = false;

            for (let i = 0; i < filteredSingleRuns.length && !duplicate; i++) {
                const compRun = filteredSingleRuns[i];
                if (run.length === compRun.length && run[0] === compRun[0] && run[1] === compRun[1]) duplicate = true;
            }

            if (!duplicate) filteredSingleRuns.push(run);
        });

        return filteredSingleRuns.concat(horizontalRuns, verticalRuns);
    }

    /**
     * Counts runs horizontally. Filters one ship runs unless unfiltered is true
     * @param [onlyCountComplete] Only count runs that start and end with an end ship (eg. up, down, left, right). Defaults to false
     * @param [onlyCountShips] don't include unknown squares in the count. Defaults to false
     * @param [unfiltered] don't filter the results for one ship runs. Defaults to false
     */
    getHorRuns (onlyCountComplete = false, onlyCountShips = false, unfiltered = false): Run[] {
        const runs = [];

        for (let y = 0; y < this.height; y++) {
            for (const run of this.getRowRuns(y, onlyCountComplete, onlyCountShips)) {
                runs.push(run);
            }
        }

        if (unfiltered) return runs;
        return runs.filter(run => run.length > 1);
    }

    /**
     * Counts runs in the given row
     * @param y The index of the row
     * @param [onlyCountComplete] Only count runs that start and end with an end ship (eg. up, down, left, right). Defaults to false
     * @param [onlyCountShips] don't include unknown squares in the count. Defaults to false
     * @throws {RangeError} If y is outside of the board
     */
    getRowRuns (y: number, onlyCountComplete = false, onlyCountShips = false): Run[] {
        if (y > this.height - 1) throw new RangeError(`y (${y}) is outside of the board (min: 0, max: ${this.height - 1})`);

        const runs = [];
        let run = [];

        for (let x = 0; x < this.width; x++) {
            if (onlyCountShips ? this.getShip([x, y]).playType === TYPE.SHIP : this.getShip([x, y]).playType !== TYPE.WATER) {
                run.push(this.posToInd([x, y]));
            } else if (run[0] !== undefined && (onlyCountComplete && onlyCountShips ? this.getShip(run[0]).isEnd() && this.getShip([x - 1, y]).isEnd() : true)) {
                // run ended, record it
                runs.push(run);
                run = [];
            } else {
                run = [];
            }
        }

        if (run[0] !== undefined && (onlyCountComplete && onlyCountShips ? this.getShip(run[0]).isEnd() && this.getShip([this.width - 1, y]).isEnd() : true)) {
            // end of the board. record any ongoing runs.
            runs.push(run);
        }

        return runs;
    }

    /**
     * Counts runs vertically. Filters one ship runs unless unfiltered == true
     * @param [onlyCountComplete] Only count runs that start and end with an end ship (eg. up, down, left, right)
     * @param [onlyCountShips] don't include unknown squares in the count
     * @param [unfiltered] don't filter the results for one ship runs
     */
    getVertRuns (onlyCountComplete = false, onlyCountShips = false, unfiltered = false): Run[] {
        const runs = [];

        for (let x = 0; x < this.width; x++) {
            for (const run of this.getColRuns(x, onlyCountComplete, onlyCountShips)) {
                runs.push(run);
            }
        }

        if (unfiltered) return runs;
        return runs.filter(run => run.length > 1);
    }

    /**
     * Counts runs in the given column
     * @param x The index of the column
     * @param [onlyCountComplete] Only count runs that start and end with an end ship (eg. up, down, left, right)
     * @param [onlyCountShips] don't include unknown squares in the count
     * @throws If x is outside of the board
     */
    getColRuns (x: number, onlyCountComplete = false, onlyCountShips = false): Run[] {
        if (x > this.width - 1) throw new RangeError(`x (${x}) must be within the board (min: 0, max: ${this.width - 1})`);

        const runs = [];
        let run = [];

        for (let y = 0; y < this.height; y++) {
            if (onlyCountShips ? this.getShip([x, y]).playType === TYPE.SHIP : this.getShip([x, y]).playType !== TYPE.WATER) {
                run.push(this.posToInd([x, y]));
            } else if (run[0] !== undefined && (onlyCountComplete && onlyCountShips ? this.getShip(run[0]).isEnd() && this.getShip([x, y - 1]).isEnd() : true)) {
                // run ended, record it
                runs.push(run);
                run = [];
            } else {
                run = [];
            }
        }

        if (run[0] !== undefined && (onlyCountComplete && onlyCountShips ? this.getShip(run[0]).isEnd() && this.getShip([x, this.height - 1]).isEnd() : true)) {
            // end of the column. record any ongoing runs.
            runs.push(run);
        }

        return runs;
    }

    /**
     * Computes the internal and graphical types based off information available
     */
    compTypes (): this {
        // for legibility
        const isShip = Ship.isShip;
        const isWater = Ship.isWater;

        for (let i = 0; i < this.state.length; i++) {
            const ship = this.getShip(i);
            if (ship.pinned && (ship.initialType > TYPE.SHIP || ship.initialType > TYPE.ORTHOGONAL) && ship.initialType !== TYPE.ORTHOGONAL) continue;
            if (!isShip(ship)) continue;

            // makes the edges act as water
            const left = this.getRelShip(i, REL_POS.LEFT) || new Ship(TYPE.WATER);
            const top = this.getRelShip(i, REL_POS.TOP) || new Ship(TYPE.WATER);
            const right = this.getRelShip(i, REL_POS.RIGHT) || new Ship(TYPE.WATER);
            const bottom = this.getRelShip(i, REL_POS.BOTTOM) || new Ship(TYPE.WATER);

            // now just do all the logic from here and have a grand ol' time
            if (isWater(left, top, right, bottom)) ship.internalType = TYPE.SINGLE;
            else if (isShip(left, right)) ship.internalType = TYPE.HORIZONTAL;
            else if (isShip(top, bottom)) ship.internalType = TYPE.VERTICAL;
            else if (ship.initialType === TYPE.ORTHOGONAL) {
                if (isShip(left) || isShip(right) || isWater(top) || isWater(bottom)) ship.internalType = TYPE.HORIZONTAL;
                else if (isShip(top) || isShip(bottom) || isWater(left) || isWater(right)) ship.internalType = TYPE.VERTICAL;
            } else if (isShip(left) && isWater(right)) ship.internalType = TYPE.LEFT;
            else if (isShip(top) && isWater(bottom)) ship.internalType = TYPE.UP;
            else if (isShip(right) && isWater(left)) ship.internalType = TYPE.RIGHT;
            else if (isShip(bottom) && isWater(top)) ship.internalType = TYPE.DOWN;
            // if surrounded by nothing, set unknown ship
            else if (ship.pinned) ship.internalType = ship.initialType;
            else ship.internalType = TYPE.SHIP;
        }

        return this;
    }

    /**
     * Converts a set of coordinates to an index
     * @throws If coordinates are not within the board or are outside of the board
     */
    coordToInd (coordinates: Coordinates): number {
        const [x, y] = coordinates;

        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            throw new TypeError(`Coordinates must be integers (are ${typeof x} and ${typeof y})`);
        }

        if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
            throw new RangeError(`Coordinates (${x}, ${y}) must be within board`);
        }

        // paranthesis for legability
        return y * this.width + x;
    }

    /**
     * Converts an index to a set of coordinates
     * @throws If coordinates are not itegers or are not within the board
     */
    indToCoord (index: number): Coordinates {
        if (index < 0 || index > this.width * this.height - 1) throw new RangeError(`Index (${index}) must be within the board (min: 0, max: ${this.width * this.height - 1})`);
        if (!Number.isInteger(index)) throw new TypeError(`Index (${index}) must be an integer (is ${typeof index})`);

        return [index % this.width, Math.floor(index / this.width)];
    }

    /**
     * Converts a position (coordinates or index) into an index
     * @throws If position is not an index or coordinates or is not within the board
     */
    posToInd (position: Position): number {
        if (typeof position === 'number') {
            if (position < 0 || position > this.width * this.height - 1) throw new RangeError(`Index (${position}) must be within the board (min: 0, max: ${this.width * this.height - 1})`);
            return position;
        } else if (Array.isArray(position) && position.length === 2) {
            if (position[0] < 0 || position[0] > this.width - 1 || position[1] < 0 || position[1] > this.height - 1) throw new RangeError(`coordinates (${position[0]}, ${position[1]}) must be within the board`);
            return this.coordToInd(position);
        }

        throw new TypeError(`Position (${position}) must be an index or array of coordinates (is ${typeof position})`);
    }

    /**
     * Get the ship at a position
     * @throws If position is not an index or coordinates or is not within the board
     */
    getShip (position: Position): Ship {
        const index = this.posToInd(position);
        return this.state[index];
    }

    /**
     * Set the ship at a position
     * @throws If position is invalid or if value is not a Ship or Ship type
     */
    setShip (position: Position, value: Ship | AnyType, pinned = false): this {
        const index = this.posToInd(position);

        let ship;

        if (typeof value === 'number') ship = new Ship(value, pinned);
        else if (!(value instanceof Ship)) throw new TypeError('value should be an instance of Ship or a ship type');
        else ship = value;

        if (pinned && typeof pinned !== 'boolean') throw new TypeError('Expected pinned to be boolean, received: ' + typeof pinned);

        this.state[index] = ship;

        return this;
    }

    /**
     * Sets the ship only if the square is unknown
     * @param position An index or array starting at 0 as [x, y]
     * @param value The ship object or type
     * @param [pinned] Should compTypes ignore the ship
     * @returns True if the ship was set, false if not
     * @throws If position is invalid
     */
    softSetShip (position: Position, value: Ship | AnyType, pinned = false): boolean {
        if (this.getShip(position).playType !== TYPE.UNKNOWN) return false;

        this.setShip(position, value, pinned);
        return true;
    }

    /**
     * Converts a relative position to an absolute index
     * @returns The absolute index or null if the square would be outside of the board
     * @throws If position is invalid
     */
    relPosToInd (position: Position, relativePosition: RelativePosition): number | null {
        const index = this.posToInd(position);

        // prevent wrap-around on the sides
        if (index % this.width === 0 && relativePosition % 3 === 0) return null;
        if (index % this.width === this.width - 1 && relativePosition % 3 === 2) return null;

        //               base     vertical offset                                        horizontal offset
        const absIndex = index + (Math.floor(relativePosition / 3) - 1) * this.width + ((relativePosition % 3) - 1);

        // check absIndex is within the board
        if (absIndex < 0 || absIndex > this.width * this.height - 1) return null;

        return absIndex;
    }

    /**
     * Get a square adjacent to the base square
     * @returns The relative ship or null if the relative ship is outside the board
     * @throws If position is invalid
     */
    getRelShip (position: Position, relativePosition: RelativePosition): Ship | null {
        const index = this.relPosToInd(position, relativePosition);
        return index !== null ? this.state[index] : null;
    }

    /**
     * Set a square adjacent to the base square if not already set
     * @returns this or null if the relative ship is outside the board
     * @throws If position is invalid
     */
    setRelShip (position: Position, relativePosition: RelativePosition, value: Ship | AnyType, pinned = false): this | null {
        const index = this.relPosToInd(position, relativePosition);

        if (index === null) return null;

        this.softSetShip(index, value, pinned);
        return this;
    }

    /**
     * Sets all surrounding squares to water
     * @param position
     * @param except The relative position to set to a ship instead of water
     * @throws If position is invalid
     */
    setCarShips (position: Position, except?: RelativePosition): this {
        for (const key in REL_POS) {
            const value: RelativePosition = REL_POS[key as keyof typeof REL_POS];

            this.setRelShip(position, value, except === value ? TYPE.SHIP : TYPE.WATER);
        }

        return this;
    }

    /**
     * Sets ships on the sides of a ship to water
     */
    setOrthoShips (position: Position, orientation: typeof TYPE.HORIZONTAL | typeof TYPE.VERTICAL): this {
        const shipDirections: RelativePosition[] = orientation === TYPE.HORIZONTAL ? [REL_POS.LEFT, REL_POS.RIGHT] : [REL_POS.TOP, REL_POS.BOTTOM];

        for (const key in REL_POS) {
            const relativePosition = REL_POS[key as keyof typeof REL_POS];

            if (!shipDirections.includes(relativePosition)) this.setRelShip(position, relativePosition, TYPE.WATER);
            else this.setRelShip(position, relativePosition, TYPE.SHIP);
        }

        return this;
    }

    /**
     * Flood the column with the given type or water, only setting unknown ships
     */
    softFloodCol (column: number, type: AnyType = TYPE.WATER): this {
        for (let y = 0; y < this.height; y++) {
            this.softSetShip([column, y], type);
        }

        return this;
    }

    /**
     * Flood the row with the given type or water, only setting unknown ships
     */
    softFloodRow (row: number, type: AnyType = TYPE.WATER): this {
        for (let x = 0; x < this.width; x++) {
            this.softSetShip([x, row], type);
        }

        return this;
    }

    /**
     * Places water in all corners around a square
     */
    floodCorners (position: Position): this {
        this.setRelShip(position, REL_POS.TOP_LEFT, TYPE.WATER);
        this.setRelShip(position, REL_POS.TOP_RIGHT, TYPE.WATER);
        this.setRelShip(position, REL_POS.BOTTOM_LEFT, TYPE.WATER);
        this.setRelShip(position, REL_POS.BOTTOM_RIGHT, TYPE.WATER);
        return this;
    }
}

function createState (width: number, height: number, preset?: Board): Ship[] {
    const out = [];

    for (let i = 0; i < width * height; i++) {
        if (preset) {
            const ship = preset.getShip(i);
            out.push(new Ship(ship.internalType, ship.pinned));
        } else {
            out.push(new Ship(TYPE.UNKNOWN));
        }
    }

    return out;
}

/**
 * Postions around a square
 */
export const REL_POS = {
    TOP_LEFT: 0,
    TOP: 1,
    TOP_RIGHT: 2,
    LEFT: 3,

    // CENTER: 4, (this)

    RIGHT: 5,
    BOTTOM_LEFT: 6,
    BOTTOM: 7,
    BOTTOM_RIGHT: 8,
} as const;

export type RelativePosition = typeof REL_POS[keyof typeof REL_POS];

/**
 * An array of indicies representing squares in a run
 */
type Run = number[];

/**
 * [x, y] starting at 0
 */
type Coordinates = [number, number];

/**
 * Coordinates or index
 */
type Position = Coordinates | number;
