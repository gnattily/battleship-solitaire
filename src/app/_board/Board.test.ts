import { expect, test } from 'vitest';

import Board, { REL_POS } from './Board';
import Ship, { TYPE } from './Ship';

test('constructor', () => {
    expect(() => { new Board(-1, 14); }).toThrow('outside expected range');

    const board = new Board(15, 7);

    expect(board.width).toBe(15);
    expect(board.height).toBe(7);
    expect(board.state.length).toBe(15 * 7);

    // the constructor is used extensively throughout testing
    // so I don't see much of a use in too extensive of tests
});

test('createState', () => {
    const blank = new Board(4, 4);
    const preset = new Board(4, 4)
        .setShip(0, TYPE.SHIP, true);
    const fromPreset = new Board(preset);

    expect(blank.state[0].equals(new Ship(TYPE.UNKNOWN))).toBeTruthy();
    expect(fromPreset.state[0].equals(new Ship(TYPE.SHIP))).toBeTruthy();
});

test('reset', () => {
    const preset = new Board(4, 4)
        .setShip([1, 3], TYPE.RIGHT)
        .setShip([0, 0], TYPE.WATER);

    const board = new Board(preset)
        .setShip([3, 0], TYPE.SHIP);

    expect(board.sameState(preset)).toBeFalsy();

    board.reset();
    expect(board.sameState(preset)).toBeTruthy();
});

test('copy', () => {
    const board1 = new Board(4, 4);
    const board1Copy = board1.copy();

    expect(board1.sameState(board1Copy)).toBeTruthy();

    board1Copy.setShip([1, 3], TYPE.LEFT);

    expect(board1.sameState(board1Copy)).toBeFalsy();

    const board2 = new Board(board1Copy)
        .setShip([3, 3], TYPE.SINGLE);
    const board2Copy = board2.copy()
        .setShip([3, 3], TYPE.UP);

    expect(board2.preset?.sameState(board2Copy.preset as Board));
});

test('sameState', () => {
    const board1 = new Board(4, 4)
        .setShip([3, 2], TYPE.UP);
    const board2 = new Board(4, 4)
        .setShip(11, TYPE.UP);
    const board3 = new Board(4, 4);
    const board4 = new Board(4, 3);

    expect(board1.sameState(board2)).toBeTruthy();
    expect(board1.sameState(board3)).toBeFalsy();
    expect(board1.sameState(board4)).toBeFalsy();
});

const board1 = new Board(6, 6,
    [2, 1, 0, 4, 0, 3],
    [0, 2, 3, 1, 1, 3],
    [3, 2, 1])
    .setShip([5, 2], TYPE.SINGLE, true)
    .setShip([1, 2], TYPE.WATER, true);

const solution1 = new Board(6, 6,
    [2, 1, 0, 4, 0, 3],
    [0, 2, 3, 1, 1, 3],
    [3, 2, 1])
    .setShip([5, 2], TYPE.SINGLE)
    .setShip([0, 1], TYPE.DOWN)
    .setShip([0, 2], TYPE.UP)
    .setShip([3, 1], TYPE.DOWN)
    .setShip([3, 2], TYPE.VERTICAL)
    .setShip([3, 3], TYPE.UP)
    .setShip([1, 5], TYPE.SINGLE)
    .setShip([3, 5], TYPE.SINGLE)
    .setShip([5, 4], TYPE.DOWN)
    .setShip([5, 5], TYPE.UP)
    .softFloodCol(0)
    .softFloodCol(1)
    .softFloodCol(2)
    .softFloodCol(3)
    .softFloodCol(4)
    .softFloodCol(5);

test('solve', () => {
    const board2 = new Board(15, 15,
        [0, 5, 6, 1, 5, 1, 5, 1, 0, 5, 3, 0, 2, 0, 1],
        [2, 0, 1, 3, 4, 2, 3, 2, 4, 0, 4, 3, 3, 2, 2],
        [5, 4, 3, 2, 1])
        .setShip([3, 0], TYPE.SHIP, true)
        .setShip([6, 0], TYPE.WATER, true)
        .setShip([1, 2], TYPE.WATER, true)
        .setShip([12, 2], TYPE.SINGLE, true)
        .setShip([2, 3], TYPE.LEFT, true)
        .setShip([5, 3], TYPE.WATER, true)
        .setShip([10, 3], TYPE.SHIP, true)
        .setShip([10, 4], TYPE.VERTICAL, true)
        .setShip([12, 4], TYPE.SINGLE, true)
        .setShip([2, 5], TYPE.DOWN, true)
        .setShip([6, 6], TYPE.SINGLE, true)
        .setShip([7, 6], TYPE.WATER, true)
        .setShip([12, 6], TYPE.WATER, true)
        .setShip([6, 7], TYPE.WATER, true)
        .setShip([10, 7], TYPE.WATER, true)
        .setShip([12, 7], TYPE.WATER, true)
        .setShip([4, 8], TYPE.SHIP, true)
        .setShip([9, 8], TYPE.WATER, true)
        .setShip([2, 10], TYPE.WATER, true)
        .setShip([6, 11], TYPE.SHIP, true)
        .setShip([9, 11], TYPE.SHIP, true)
        .setShip([14, 11], TYPE.WATER, true)
        .setShip([2, 12], TYPE.WATER, true)
        .setShip([3, 12], TYPE.WATER, true)
        .setShip([7, 12], TYPE.WATER, true)
        .setShip([9, 12], TYPE.SHIP, true)
        .setShip([1, 13], TYPE.UP, true)
        .setShip([6, 13], TYPE.WATER, true)
        .setShip([3, 14], TYPE.WATER, true)
        .setShip([14, 14], TYPE.SINGLE, true);

    const solution2 = new Board(15, 15,
        [0, 5, 6, 1, 5, 1, 5, 1, 0, 5, 3, 0, 2, 0, 1],
        [2, 0, 1, 3, 4, 2, 3, 2, 4, 0, 4, 3, 3, 2, 2],
        [5, 4, 3, 2, 1])
        .setShip([2, 0], TYPE.RIGHT)
        .setShip([3, 0], TYPE.LEFT)
        .setShip([12, 2], TYPE.SINGLE)
        .setShip([1, 3], TYPE.RIGHT)
        .setShip([2, 3], TYPE.LEFT)
        .setShip([10, 3], TYPE.DOWN)
        .setShip([10, 4], TYPE.VERTICAL)
        .setShip([10, 5], TYPE.UP)
        .setShip([4, 4], TYPE.RIGHT)
        .setShip([5, 4], TYPE.LEFT)
        .setShip([12, 4], TYPE.SINGLE)
        .setShip([2, 5], TYPE.DOWN)
        .setShip([2, 6], TYPE.VERTICAL)
        .setShip([2, 7], TYPE.VERTICAL)
        .setShip([2, 8], TYPE.UP)
        .setShip([4, 6], TYPE.DOWN)
        .setShip([4, 7], TYPE.VERTICAL)
        .setShip([4, 8], TYPE.UP)
        .setShip([6, 6], TYPE.SINGLE)
        .setShip([6, 8], TYPE.RIGHT)
        .setShip([7, 8], TYPE.LEFT)
        .setShip([1, 10], TYPE.DOWN)
        .setShip([1, 11], TYPE.VERTICAL)
        .setShip([1, 12], TYPE.VERTICAL)
        .setShip([1, 13], TYPE.UP)
        .setShip([4, 10], TYPE.SINGLE)
        .setShip([6, 10], TYPE.DOWN)
        .setShip([6, 11], TYPE.VERTICAL)
        .setShip([6, 12], TYPE.UP)
        .setShip([9, 10], TYPE.DOWN)
        .setShip([9, 11], TYPE.VERTICAL)
        .setShip([9, 12], TYPE.VERTICAL)
        .setShip([9, 13], TYPE.VERTICAL)
        .setShip([9, 14], TYPE.UP)
        .setShip([14, 14], TYPE.SINGLE)
        .softFloodRow(0)
        .softFloodRow(1)
        .softFloodRow(2)
        .softFloodRow(3)
        .softFloodRow(4)
        .softFloodRow(5)
        .softFloodRow(6)
        .softFloodRow(7)
        .softFloodRow(8)
        .softFloodRow(9)
        .softFloodRow(10)
        .softFloodRow(11)
        .softFloodRow(12)
        .softFloodRow(13)
        .softFloodRow(14);

    const board3 = new Board(15, 15,
        [4, 0, 4, 1, 3, 6, 2, 0, 6, 1, 1, 1, 2, 2, 1],
        [1, 2, 5, 2, 3, 2, 4, 2, 2, 0, 5, 0, 1, 3, 2],
        [4, 4, 3, 2, 1])
        .setShip([0, 1], TYPE.DOWN, true)
        .setShip([0, 3], TYPE.ORTHOGONAL, true)
        .setShip([2, 5], TYPE.DOWN, true)
        .setShip([3, 10], TYPE.ORTHOGONAL, true)
        .setShip([6, 13], TYPE.UP, true)
        .setShip([8, 5], TYPE.UP, true)
        .setShip([8, 14], TYPE.WATER, true)
        .setShip([9, 2], TYPE.ORTHOGONAL, true)
        .setShip([12, 6], TYPE.ORTHOGONAL, true)
        .setShip([12, 13], TYPE.SINGLE, true);

    const solution3 = board3.copy()
        .setShip([0, 2], TYPE.VERTICAL)
        .setShip([0, 3], TYPE.VERTICAL)
        .setShip([0, 4], TYPE.UP)
        .setShip([2, 6], TYPE.VERTICAL)
        .setShip([2, 7], TYPE.UP)
        .setShip([2, 10], TYPE.RIGHT)
        .setShip([3, 10], TYPE.HORIZONTAL)
        .setShip([4, 10], TYPE.HORIZONTAL)
        .setShip([5, 10], TYPE.LEFT)
        .setShip([5, 0], TYPE.DOWN)
        .setShip([5, 1], TYPE.VERTICAL)
        .setShip([5, 2], TYPE.VERTICAL)
        .setShip([5, 3], TYPE.VERTICAL)
        .setShip([5, 4], TYPE.UP)
        .setShip([4, 13], TYPE.DOWN)
        .setShip([4, 14], TYPE.UP)
        .setShip([6, 12], TYPE.DOWN)
        .setShip([8, 2], TYPE.RIGHT)
        .setShip([9, 2], TYPE.HORIZONTAL)
        .setShip([10, 2], TYPE.LEFT)
        .setShip([8, 4], TYPE.DOWN)
        .setShip([8, 7], TYPE.DOWN)
        .setShip([8, 8], TYPE.UP)
        .setShip([8, 10], TYPE.SINGLE)
        .setShip([11, 6], TYPE.RIGHT)
        .setShip([12, 6], TYPE.HORIZONTAL)
        .setShip([13, 6], TYPE.LEFT)
        .setShip([13, 8], TYPE.SINGLE)
        .setShip([14, 14], TYPE.SINGLE);

    for (let x = 0; x < solution3.width; x++) {
        solution3.softFloodCol(x);
    }

    expect(board1.copy().solve().sameState(solution1)).toBeTruthy();
    expect(board2.copy().solve().sameState(solution2)).toBeTruthy();
    expect(board3.copy().solve().sameState(solution3)).toBeTruthy();
});

test('isSolved', () => {
    const board = new Board(4, 4, [3, 0, 0, 3], [2, 2, 1, 1], [1, 1, 1])
        .softFloodCol(1)
        .softFloodCol(2)
        .softFloodRow(3)
        .softFloodCol(0, TYPE.SHIP);

    // test unknown
    expect(board.isSolved()).toBeFalsy();

    // test rows
    board.softFloodCol(3, TYPE.SHIP);
    expect(board.isSolved()).toBeFalsy();

    // test columns
    board.setShip([0, 2], TYPE.WATER);
    expect(board.isSolved()).toBeFalsy();

    // test multiple solutions
    board.setShip([0, 3], TYPE.SHIP);
    expect(board.isSolved()).toBeTruthy();

    board.setShip([3, 2], TYPE.WATER);
    board.setShip([3, 3], TYPE.SHIP);
    board.setShip([0, 2], TYPE.SHIP);
    board.setShip([0, 3], TYPE.WATER);
    expect(board.isSolved()).toBeTruthy();

    // test runs (this board is impossible to solve by the way)
    const board2 = new Board(board, [3, 0, 0, 3], [2, 2, 1, 1], [0, 1, 1]);
    expect(board2.isSolved()).toBeFalsy();
});

test('countCol', () => {
    const col0 = board1.countCol(0);
    expect(col0[0]).toBe(0);
    expect(col0[1]).toBe(6);

    const col5 = board1.countCol(5);
    expect(col5[0]).toBe(1);
    expect(col5[1]).toBe(5);

    const ansCol3 = solution1.countCol(3);
    expect(ansCol3[0]).toBe(4);
    expect(ansCol3[1]).toBe(0);

    expect(() => { board1.countCol(6); }).toThrow('is outside of the board');
    expect(() => { board1.countCol(-1); }).toThrow('is outside of the board');
});

test('countRow', () => {
    const row0 = board1.countRow(0);
    expect(row0[0]).toBe(0);
    expect(row0[1]).toBe(6);

    const row5 = board1.countRow(2);
    expect(row5[0]).toBe(1);
    expect(row5[1]).toBe(4);

    const ansRow3 = solution1.countRow(2);
    expect(ansRow3[0]).toBe(3);
    expect(ansRow3[1]).toBe(0);

    expect(() => { board1.countRow(6); }).toThrow('is outside of the board');
    expect(() => { board1.countRow(-1); }).toThrow('is outside of the board');
});

test('countRunsLeft', () => {
    expect(new Board(4, 4).countRunsLeft()).toEqual([]);

    expect(board1.countRunsLeft()).toEqual([2, 2, 1]);
    expect(board1.countRunsLeft(true)).toEqual([2, 2, 1]);

    const tempBoard = board1.copy()
        .setShip([0, 0], TYPE.RIGHT)
        .setShip([1, 0], TYPE.HORIZONTAL);

    expect(tempBoard.countRunsLeft()).toEqual([2, 1, 1]);
    expect(tempBoard.countRunsLeft(true)).toEqual([2, 2, 1]);

    tempBoard.setShip([2, 0], TYPE.LEFT);

    expect(tempBoard.countRunsLeft()).toEqual([2, 2, 0]);
    expect(tempBoard.countRunsLeft(true)).toEqual([2, 2, 0]);
});

test('getRuns', () => {
    expect(board1.getRuns()).toEqual([[17]]);
    expect(board1.getRuns(true)).toEqual([[17]]);

    const tempBoard = board1.copy()
        .setShip([0, 0], TYPE.RIGHT)
        .setShip([1, 0], TYPE.HORIZONTAL);

    expect(tempBoard.getRuns()).toEqual([[17], [0, 1]]);
    expect(tempBoard.getRuns(true)).toEqual([[17]]);

    tempBoard.setShip([2, 0], TYPE.LEFT);

    expect(tempBoard.getRuns()).toEqual([[17], [0, 1, 2]]);
    expect(tempBoard.getRuns(true)).toEqual([[17], [0, 1, 2]]);
});

test('getHorRuns', () => {
    expect(board1.getHorRuns()[0]).toEqual([0, 1, 2, 3, 4, 5]);
    expect(board1.getHorRuns(true, false, false)[0]).toEqual([0, 1, 2, 3, 4, 5]);
    expect(board1.getHorRuns(true, true, false)).toEqual([]);

    const tempBoard = board1.copy()
        .setShip([0, 0], TYPE.RIGHT)
        .setShip([1, 0], TYPE.HORIZONTAL);

    expect(tempBoard.getHorRuns(false, true, false)).toEqual([[0, 1]]);
    expect(tempBoard.getHorRuns(true, true, false)).toEqual([]);
    expect(tempBoard.getHorRuns(false, true, true)).toEqual([[0, 1], [17]]);
    expect(tempBoard.getHorRuns(true, true, true)).toEqual([[17]]);

    tempBoard.setShip([2, 0], TYPE.LEFT);

    expect(tempBoard.getHorRuns(false, true, false)).toEqual([[0, 1, 2]]);
    expect(tempBoard.getHorRuns(true, true, false)).toEqual([[0, 1, 2]]);
    expect(tempBoard.getHorRuns(false, true, true)).toEqual([[0, 1, 2], [17]]);
    expect(tempBoard.getHorRuns(true, true, true)).toEqual([[0, 1, 2], [17]]);
});

test('getRowRuns', () => {
    expect(() => { board1.getRowRuns(6); }).toThrow('outside of the board');

    // check if behavior with undefined squares is expected
    expect(board1.getRowRuns(2, true, true)).toEqual([[17]]);

    const tempBoard = board1.copy()
        .setShip([0, 0], TYPE.RIGHT)
        .setShip([1, 0], TYPE.HORIZONTAL);

    expect(tempBoard.getRowRuns(0, false, true)).toEqual([[0, 1]]);
    expect(tempBoard.getRowRuns(0, true, true)).toEqual([]);

    tempBoard.setShip([2, 0], TYPE.LEFT);

    expect(tempBoard.getRowRuns(0, false, true)).toEqual([[0, 1, 2]]);
    expect(tempBoard.getRowRuns(0, true, true)).toEqual([[0, 1, 2]]);
});

test('getVertRuns', () => {
    expect(board1.getVertRuns()[0]).toEqual([0, 6, 12, 18, 24, 30]);
    expect(board1.getVertRuns(true, false, false)[0]).toEqual([0, 6, 12, 18, 24, 30]);
    expect(board1.getVertRuns(true, true, false)).toEqual([]);

    const tempBoard = board1.copy()
        .setShip([0, 0], TYPE.DOWN)
        .setShip([0, 1], TYPE.VERTICAL);

    expect(tempBoard.getVertRuns(false, true, false)).toEqual([[0, 6]]);
    expect(tempBoard.getVertRuns(true, true, false)).toEqual([]);
    expect(tempBoard.getVertRuns(false, true, true)).toEqual([[0, 6], [17]]);
    expect(tempBoard.getVertRuns(true, true, true)).toEqual([[17]]);

    tempBoard.setShip([0, 2], TYPE.UP);

    expect(tempBoard.getVertRuns(false, true, false)).toEqual([[0, 6, 12]]);
    expect(tempBoard.getVertRuns(true, true, false)).toEqual([[0, 6, 12]]);
    expect(tempBoard.getVertRuns(false, true, true)).toEqual([[0, 6, 12], [17]]);
    expect(tempBoard.getVertRuns(true, true, true)).toEqual([[0, 6, 12], [17]]);
});

test('getColRuns', () => {
    expect(() => { board1.getColRuns(6); }).toThrow('must be within the board');

    // check if behavior with undefined squares is expected
    expect(board1.getColRuns(5, true, true)).toEqual([[17]]);

    const tempBoard = board1.copy()
        .setShip([0, 0], TYPE.DOWN)
        .setShip([0, 1], TYPE.VERTICAL);

    expect(tempBoard.getColRuns(0, false, true)).toEqual([[0, 6]]);
    expect(tempBoard.getColRuns(0, true, true)).toEqual([]);

    tempBoard.setShip([0, 2], TYPE.UP);

    expect(tempBoard.getColRuns(0, false, true)).toEqual([[0, 6, 12]]);
    expect(tempBoard.getColRuns(0, true, true)).toEqual([[0, 6, 12]]);
});

test('compTypes', () => {
    const board = new Board(6, 6)
        .setShip(0, TYPE.RIGHT, true)
        .setShip(1, TYPE.SHIP, true)
        .setShip(2, TYPE.SHIP)
        .setShip([0, 5], TYPE.SHIP)
        .setShip([1, 5], TYPE.SHIP)
        .setShip([2, 5], TYPE.SHIP)
        .setShip([3, 5], TYPE.SHIP)
        .setShip([5, 5], TYPE.SHIP)
        .setShip([5, 3], TYPE.SHIP)
        .setShip([5, 2], TYPE.SHIP)
        .setShip([5, 1], TYPE.SHIP)
        .setShip([5, 0], TYPE.SHIP)
        .softFloodCol(4)
        .softFloodRow(4)
        .setShip([1, 2], TYPE.RIGHT);

    expect(board.compTypes() instanceof Board).toBeTruthy();

    expect(board.getShip(0).graphicalType).toBe(TYPE.RIGHT);
    expect(board.getShip(1).internalType).toBe(TYPE.HORIZONTAL);
    expect(board.getShip(2).graphicalType).toBe(TYPE.SHIP);
    expect(board.getShip([0, 5]).graphicalType).toBe(TYPE.RIGHT);
    expect(board.getShip([1, 5]).internalType).toBe(TYPE.HORIZONTAL);
    expect(board.getShip([1, 5]).graphicalType).toBe(TYPE.ORTHOGONAL);
    expect(board.getShip([2, 5]).internalType).toBe(TYPE.HORIZONTAL);
    expect(board.getShip([2, 5]).graphicalType).toBe(TYPE.ORTHOGONAL);
    expect(board.getShip([3, 5]).graphicalType).toBe(TYPE.LEFT);
    expect(board.getShip([5, 5]).graphicalType).toBe(TYPE.SINGLE);
    expect(board.getShip([5, 3]).graphicalType).toBe(TYPE.UP);
    expect(board.getShip([5, 2]).internalType).toBe(TYPE.VERTICAL);
    expect(board.getShip([5, 2]).graphicalType).toBe(TYPE.ORTHOGONAL);
    expect(board.getShip([5, 1]).internalType).toBe(TYPE.VERTICAL);
    expect(board.getShip([5, 1]).graphicalType).toBe(TYPE.ORTHOGONAL);
    expect(board.getShip([5, 0]).graphicalType).toBe(TYPE.DOWN);
    expect(board.getShip([1, 2]).graphicalType).toBe(TYPE.SHIP);
});

test('coordToInd', () => {
    const board = new Board(4, 4);
    expect(() => { board.coordToInd([4, 4]); }).toThrow('must be within board');

    expect(board.coordToInd([3, 3])).toBe(15);
});

test('indToCoord', () => {
    const board = new Board(4, 4);
    expect(() => { board.indToCoord(-1); }).toThrow('must be within the board');
    expect(() => { board.indToCoord(16); }).toThrow('must be within the board');

    expect(board.indToCoord(15)).toStrictEqual([3, 3]);
});

test('posToInd', () => {
    const board = new Board(4, 4);
    expect(() => { board.posToInd(-1); }).toThrow('must be within the board');
    expect(() => { board.posToInd(16); }).toThrow('must be within the board');
    expect(() => { board.posToInd([-1, 0]); }).toThrow('must be within the board');
    expect(() => { board.posToInd([4, 3]); }).toThrow('must be within the board');

    expect(board.posToInd(4)).toBe(4);
    expect(board.posToInd([0, 1])).toBe(4);
});

test('getShip', () => {
    const board = new Board(4, 4);
    board.state[8] = new Ship(TYPE.SINGLE, true);

    expect(board.getShip(8).graphicalType).toBe(TYPE.SINGLE);
    expect(board.getShip(8).pinned).toBeTruthy();
});

test('setShip', () => {
    const board = new Board(4, 4);
    board.setShip(0, TYPE.DOWN);
    board.setShip(15, new Ship(TYPE.RIGHT));
    board.setShip([1, 0], TYPE.HORIZONTAL);

    expect(board.getShip(0).graphicalType).toBe(TYPE.DOWN);
    expect(board.state[15].graphicalType).toBe(TYPE.RIGHT);
    expect(board.getShip(1).internalType).toBe(TYPE.HORIZONTAL);
    expect(board.setShip(5, TYPE.SHIP) instanceof Board).toBeTruthy();
});

test('softSetShip', () => {
    const board = new Board(4, 4);

    expect(board.softSetShip(7, TYPE.HORIZONTAL)).toBeTruthy();
    expect(board.state[7].internalType).toBe(TYPE.HORIZONTAL);
    expect(board.softSetShip(7, TYPE.LEFT)).toBeFalsy();
    expect(board.state[7].internalType).toBe(TYPE.HORIZONTAL);
});

test('relPosToInd', () => {
    const board = new Board(4, 4);

    expect(board.relPosToInd(0, REL_POS.RIGHT)).toBe(1);
    expect(board.relPosToInd(0, REL_POS.LEFT)).toBeNull();
    expect(board.relPosToInd(3, REL_POS.RIGHT)).toBeNull();
});

test('getRelShip', () => {
    const board = new Board(4, 4);
    board.setShip(0, TYPE.SHIP);
    board.setShip(1, TYPE.WATER);
    board.setShip(4, TYPE.VERTICAL);

    expect(board.getRelShip(0, REL_POS.BOTTOM)?.internalType).toBe(TYPE.VERTICAL);
    expect(board.getRelShip(0, REL_POS.LEFT)).toBeNull();
    expect(board.getRelShip(0, REL_POS.RIGHT)?.playType).toBe(TYPE.WATER);
});

test('setRelShip', () => {
    const board = new Board(4, 4);

    expect(board.setRelShip(0, REL_POS.RIGHT, TYPE.SHIP)).toBeTruthy();
    expect(board.setRelShip(0, REL_POS.LEFT, TYPE.SHIP)).toBeNull();
    expect(board.state[1].playType).toBe(TYPE.SHIP);
});

test('setCarShips', () => {
    const board = new Board(4, 4);
    expect(board.setCarShips([1, 1], REL_POS.TOP) instanceof Board).toBeTruthy();

    expect(board.state[0].playType).toBe(TYPE.WATER);
    expect(board.state[1].playType).toBe(TYPE.SHIP);
    expect(board.state[2].playType).toBe(TYPE.WATER);
    expect(board.state[4].playType).toBe(TYPE.WATER);
    expect(board.state[6].playType).toBe(TYPE.WATER);
    expect(board.state[8].playType).toBe(TYPE.WATER);
    expect(board.state[9].playType).toBe(TYPE.WATER);
    expect(board.state[10].playType).toBe(TYPE.WATER);
});

test('setOrthoShips', () => {
    const board = new Board(4, 4);
    expect(board.setOrthoShips([1, 1], TYPE.VERTICAL) instanceof Board).toBeTruthy();

    expect(board.state[0].playType).toBe(TYPE.WATER);
    expect(board.state[1].playType).toBe(TYPE.SHIP);
    expect(board.state[2].playType).toBe(TYPE.WATER);
    expect(board.state[4].playType).toBe(TYPE.WATER);
    expect(board.state[6].playType).toBe(TYPE.WATER);
    expect(board.state[8].playType).toBe(TYPE.WATER);
    expect(board.state[9].playType).toBe(TYPE.SHIP);
    expect(board.state[10].playType).toBe(TYPE.WATER);
});

test('softFloodCol', () => {
    const board = new Board(4, 4);

    expect(board.softFloodCol(0) instanceof Board).toBeTruthy();
    expect(board.state[0].playType).toBe(TYPE.WATER);
    expect(board.state[4].playType).toBe(TYPE.WATER);
    expect(board.state[8].playType).toBe(TYPE.WATER);
    expect(board.state[12].playType).toBe(TYPE.WATER);

    expect(board.softFloodCol(3, TYPE.SHIP) instanceof Board).toBeTruthy();
    expect(board.state[3].playType).toBe(TYPE.SHIP);
    expect(board.state[7].playType).toBe(TYPE.SHIP);
    expect(board.state[11].playType).toBe(TYPE.SHIP);
    expect(board.state[15].playType).toBe(TYPE.SHIP);
});

test('softFloodRow', () => {
    const board = new Board(4, 4);

    expect(board.softFloodRow(0) instanceof Board).toBeTruthy();
    expect(board.state[0].playType).toBe(TYPE.WATER);
    expect(board.state[1].playType).toBe(TYPE.WATER);
    expect(board.state[2].playType).toBe(TYPE.WATER);
    expect(board.state[3].playType).toBe(TYPE.WATER);

    expect(board.softFloodRow(3, TYPE.SHIP) instanceof Board).toBeTruthy();
    expect(board.state[12].playType).toBe(TYPE.SHIP);
    expect(board.state[13].playType).toBe(TYPE.SHIP);
    expect(board.state[14].playType).toBe(TYPE.SHIP);
    expect(board.state[15].playType).toBe(TYPE.SHIP);
});

test('floodCorners', () => {
    const board = new Board(4, 4);

    expect(board.floodCorners([1, 1]) instanceof Board).toBeTruthy();
    expect(board.state[0].playType).toBe(TYPE.WATER);
    expect(board.state[2].playType).toBe(TYPE.WATER);
    expect(board.state[8].playType).toBe(TYPE.WATER);
    expect(board.state[10].playType).toBe(TYPE.WATER);
});

test('base64 export/import', () => {
    // literally an empty board
    const empty = new Board(10, 10,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [5, 4, 3, 2, 1],
    );
    const emptyB64 = empty.export();
    expect(() => { Board.from(emptyB64); }).not.toThrow();

    // board 1
    const board1B64 = board1.export();
    const importedBoard1 = Board.from(board1B64);

    expect(importedBoard1.sameState(board1)).toBeTruthy();
    expect(importedBoard1.colCounts).toEqual(board1.colCounts);
    expect(importedBoard1.rowCounts).toEqual(board1.rowCounts);
    expect(importedBoard1.runs).toEqual(board1.runs);

    // board 2
    const board2 = new Board(4, 4, [2, 0, 0, 0], [1, 1, 0, 0], [4, 3, 2, 1])
        .setShip(0, TYPE.DOWN)
        .setShip(2, TYPE.UP);
    const board2B64 = board2.export();
    const importedBoard2 = Board.from(board2B64);

    expect(importedBoard2.sameState(board2)).toBeTruthy();
    expect(importedBoard2.colCounts).toEqual(board2.colCounts);
    expect(importedBoard2.rowCounts).toEqual(board2.rowCounts);
    expect(importedBoard2.runs).toEqual(board2.runs);

    // board 3
    const board3 = new Board(2, 2)
        .setShip(0, TYPE.DOWN)
        .setShip(2, TYPE.UP);
    const board3B64 = board3.export();
    const importedBoard3 = Board.from(board3B64);

    expect(importedBoard3.sameState(board3)).toBeTruthy();
    expect(importedBoard3.colCounts).toEqual([]);
    expect(importedBoard3.rowCounts).toEqual([]);
    expect(importedBoard3.runs).toEqual([]);

    // board 4
    const board4 = new Board(16, 16)
        .setShip([2, 0], TYPE.SINGLE, true)
        .setShip([6, 4], TYPE.WATER);
    const board4B64 = board4.export();
    const importedBoard4 = Board.from(board4B64);

    expect(importedBoard4.sameState(board4)).toBeTruthy();

    // check none are too long (implies repeat functionality is broken)
    // purposefully omitting board1 here since it's massive and should be
    expect(board2B64.length).toBeLessThan(30);
    expect(board3B64.length).toBeLessThan(30);
    expect(board4B64.length).toBeLessThan(30);
});
