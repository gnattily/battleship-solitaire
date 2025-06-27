import { expect, test } from 'vitest';

import BoardBuilder, { RELATIVE_POSITIONS } from './BoardBuilder';
import Ship, { GRAPHICAL_TYPES, PLAY_TYPES } from './Ship';

test('constructor', () => {
    const badPreset = new BoardBuilder(4, 5);
    const defaultSize = new BoardBuilder();

    expect(() => { new BoardBuilder(4, 4, badPreset); }).toThrow('same size');
    expect(defaultSize.width).toBe(4);
    expect(defaultSize.height).toBe(4);
});

test('createBoardState', () => {
    const blank = new BoardBuilder(4, 4);
    const preset = new BoardBuilder(4, 4)
        .setShip(0, PLAY_TYPES.SHIP, true);
    const fromPreset = new BoardBuilder(4, 4, preset);

    expect(blank.boardState[0].equals(new Ship(PLAY_TYPES.UNKNOWN))).toBeTruthy();
    expect(fromPreset.boardState[0].equals(new Ship(PLAY_TYPES.SHIP))).toBeTruthy();
});

test('reset', () => {
    const preset = new BoardBuilder(4, 4)
        .setShip([1, 3], GRAPHICAL_TYPES.RIGHT)
        .setShip([0, 0], PLAY_TYPES.WATER);

    const board = new BoardBuilder(4, 4, preset)
        .setShip([3, 0], PLAY_TYPES.SHIP);

    expect(board.sameBoardState(preset)).toBeFalsy();

    board.reset();
    expect(board.sameBoardState(preset)).toBeTruthy();
});

test('copy', () => {
    const board1 = new BoardBuilder(4, 4);
    const board2 = board1.copy();

    expect(board1.sameBoardState(board2)).toBeTruthy();

    board2.setShip([2, 3], GRAPHICAL_TYPES.LEFT);

    expect(board1.sameBoardState(board2)).toBeFalsy();
});

test('sameBoardState', () => {
    const board1 = new BoardBuilder(4, 4)
        .setShip([3, 2], GRAPHICAL_TYPES.UP);
    const board2 = new BoardBuilder(4, 4)
        .setShip(11, GRAPHICAL_TYPES.UP);
    const board3 = new BoardBuilder(4, 4);
    const board4 = new BoardBuilder(4, 3);

    expect(board1.sameBoardState(board2)).toBeTruthy();
    expect(board1.sameBoardState(board3)).toBeFalsy();
    expect(board1.sameBoardState(board4)).toBeFalsy();
});

const board1 = new BoardBuilder(6, 6, undefined,
    [2, 1, 0, 4, 0, 3], [0, 2, 3, 1, 1, 3], [3, 2, 1])
    .setShip([5, 2], GRAPHICAL_TYPES.SINGLE, true)
    .setShip([1, 2], PLAY_TYPES.WATER, true);

const solution1 = new BoardBuilder(6, 6, undefined,
    [2, 1, 0, 4, 0, 3], [0, 2, 3, 1, 1, 3], [3, 2, 1])
    .setShip([5, 2], GRAPHICAL_TYPES.SINGLE)
    .setShip([0, 1], GRAPHICAL_TYPES.DOWN)
    .setShip([0, 2], GRAPHICAL_TYPES.UP)
    .setShip([3, 1], GRAPHICAL_TYPES.DOWN)
    .setShip([3, 2], GRAPHICAL_TYPES.VERTICAL)
    .setShip([3, 3], GRAPHICAL_TYPES.UP)
    .setShip([1, 5], GRAPHICAL_TYPES.SINGLE)
    .setShip([3, 5], GRAPHICAL_TYPES.SINGLE)
    .setShip([5, 4], GRAPHICAL_TYPES.DOWN)
    .setShip([5, 5], GRAPHICAL_TYPES.UP)
    .softFloodColumn(0)
    .softFloodColumn(1)
    .softFloodColumn(2)
    .softFloodColumn(3)
    .softFloodColumn(4)
    .softFloodColumn(5);

test('solve', () => {
    const board2 = new BoardBuilder(15, 15, undefined,
        [0, 5, 6, 1, 5, 1, 5, 1, 0, 5, 3, 0, 2, 0, 1],
        [2, 0, 1, 3, 4, 2, 3, 2, 4, 0, 4, 3, 3, 2, 2],
        [5, 4, 3, 2, 1])
        .setShip([3, 0], GRAPHICAL_TYPES.SHIP, true)
        .setShip([6, 0], GRAPHICAL_TYPES.WATER, true)
        .setShip([1, 2], GRAPHICAL_TYPES.WATER, true)
        .setShip([12, 2], GRAPHICAL_TYPES.SINGLE, true)
        .setShip([2, 3], GRAPHICAL_TYPES.LEFT, true)
        .setShip([5, 3], GRAPHICAL_TYPES.WATER, true)
        .setShip([10, 3], GRAPHICAL_TYPES.SHIP, true)
        .setShip([10, 4], GRAPHICAL_TYPES.VERTICAL, true)
        .setShip([12, 4], GRAPHICAL_TYPES.SINGLE, true)
        .setShip([2, 5], GRAPHICAL_TYPES.DOWN, true)
        .setShip([6, 6], GRAPHICAL_TYPES.SINGLE, true)
        .setShip([7, 6], GRAPHICAL_TYPES.WATER, true)
        .setShip([12, 6], GRAPHICAL_TYPES.WATER, true)
        .setShip([6, 7], GRAPHICAL_TYPES.WATER, true)
        .setShip([10, 7], GRAPHICAL_TYPES.WATER, true)
        .setShip([12, 7], GRAPHICAL_TYPES.WATER, true)
        .setShip([4, 8], GRAPHICAL_TYPES.SHIP, true)
        .setShip([9, 8], GRAPHICAL_TYPES.WATER, true)
        .setShip([2, 10], GRAPHICAL_TYPES.WATER, true)
        .setShip([6, 11], GRAPHICAL_TYPES.SHIP, true)
        .setShip([9, 11], GRAPHICAL_TYPES.SHIP, true)
        .setShip([14, 11], GRAPHICAL_TYPES.WATER, true)
        .setShip([2, 12], GRAPHICAL_TYPES.WATER, true)
        .setShip([3, 12], GRAPHICAL_TYPES.WATER, true)
        .setShip([7, 12], GRAPHICAL_TYPES.WATER, true)
        .setShip([9, 12], GRAPHICAL_TYPES.SHIP, true)
        .setShip([1, 13], GRAPHICAL_TYPES.UP, true)
        .setShip([6, 13], GRAPHICAL_TYPES.WATER, true)
        .setShip([3, 14], GRAPHICAL_TYPES.WATER, true)
        .setShip([14, 14], GRAPHICAL_TYPES.SINGLE, true);

    const solution2 = new BoardBuilder(15, 15, undefined,
        [0, 5, 6, 1, 5, 1, 5, 1, 0, 5, 3, 0, 2, 0, 1],
        [2, 0, 1, 3, 4, 2, 3, 2, 4, 0, 4, 3, 3, 2, 2],
        [5, 4, 3, 2, 1])
        .setShip([2, 0], GRAPHICAL_TYPES.RIGHT)
        .setShip([3, 0], GRAPHICAL_TYPES.LEFT)
        .setShip([12, 2], GRAPHICAL_TYPES.SINGLE)
        .setShip([1, 3], GRAPHICAL_TYPES.RIGHT)
        .setShip([2, 3], GRAPHICAL_TYPES.LEFT)
        .setShip([10, 3], GRAPHICAL_TYPES.DOWN)
        .setShip([10, 4], GRAPHICAL_TYPES.VERTICAL)
        .setShip([10, 5], GRAPHICAL_TYPES.UP)
        .setShip([4, 4], GRAPHICAL_TYPES.RIGHT)
        .setShip([5, 4], GRAPHICAL_TYPES.LEFT)
        .setShip([12, 4], GRAPHICAL_TYPES.SINGLE)
        .setShip([2, 5], GRAPHICAL_TYPES.DOWN)
        .setShip([2, 6], GRAPHICAL_TYPES.VERTICAL)
        .setShip([2, 7], GRAPHICAL_TYPES.VERTICAL)
        .setShip([2, 8], GRAPHICAL_TYPES.UP)
        .setShip([4, 6], GRAPHICAL_TYPES.DOWN)
        .setShip([4, 7], GRAPHICAL_TYPES.VERTICAL)
        .setShip([4, 8], GRAPHICAL_TYPES.UP)
        .setShip([6, 6], GRAPHICAL_TYPES.SINGLE)
        .setShip([6, 8], GRAPHICAL_TYPES.RIGHT)
        .setShip([7, 8], GRAPHICAL_TYPES.LEFT)
        .setShip([1, 10], GRAPHICAL_TYPES.DOWN)
        .setShip([1, 11], GRAPHICAL_TYPES.VERTICAL)
        .setShip([1, 12], GRAPHICAL_TYPES.VERTICAL)
        .setShip([1, 13], GRAPHICAL_TYPES.UP)
        .setShip([4, 10], GRAPHICAL_TYPES.SINGLE)
        .setShip([6, 10], GRAPHICAL_TYPES.DOWN)
        .setShip([6, 11], GRAPHICAL_TYPES.VERTICAL)
        .setShip([6, 12], GRAPHICAL_TYPES.UP)
        .setShip([9, 10], GRAPHICAL_TYPES.DOWN)
        .setShip([9, 11], GRAPHICAL_TYPES.VERTICAL)
        .setShip([9, 12], GRAPHICAL_TYPES.VERTICAL)
        .setShip([9, 13], GRAPHICAL_TYPES.VERTICAL)
        .setShip([9, 14], GRAPHICAL_TYPES.UP)
        .setShip([14, 14], GRAPHICAL_TYPES.SINGLE)
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

    expect(BoardBuilder.solve(board1).sameBoardState(solution1)).toBeTruthy();
    expect(BoardBuilder.solve(board2).sameBoardState(solution2)).toBeTruthy();
});

test('isSolved', () => {
    const board = new BoardBuilder(4, 4, undefined, [3, 0, 0, 3], [2, 2, 1, 1], [1, 1, 1])
        .softFloodColumn(1)
        .softFloodColumn(2)
        .softFloodRow(3)
        .softFloodColumn(0, PLAY_TYPES.SHIP);

    // test unknown
    expect(board.isSolved()).toBeFalsy();

    // test rows
    board.softFloodColumn(3, PLAY_TYPES.SHIP);
    expect(board.isSolved()).toBeFalsy();

    // test columns
    board.setShip([0, 2], PLAY_TYPES.WATER);
    expect(board.isSolved()).toBeFalsy();

    // test multiple solutions
    board.setShip([0, 3], PLAY_TYPES.SHIP);
    expect(board.isSolved()).toBeTruthy();

    board.setShip([3, 2], PLAY_TYPES.WATER);
    board.setShip([3, 3], PLAY_TYPES.SHIP);
    board.setShip([0, 2], PLAY_TYPES.SHIP);
    board.setShip([0, 3], PLAY_TYPES.WATER);
    expect(board.isSolved()).toBeTruthy();

    // test runs (this board is impossible to solve by the way)
    const board2 = new BoardBuilder(4, 4, board, [3, 0, 0, 3], [2, 2, 1, 1], [0, 1, 1]);
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
    expect(new BoardBuilder(4, 4).countRunsLeft()).toBeUndefined();

    expect(board1.countRunsLeft()).toEqual([2, 2, 1]);
    expect(board1.countRunsLeft(true)).toEqual([2, 2, 1]);

    const tempBoard = board1.copy()
        .setShip([0, 0], GRAPHICAL_TYPES.RIGHT)
        .setShip([1, 0], GRAPHICAL_TYPES.HORIZONTAL);

    expect(tempBoard.countRunsLeft()).toEqual([2, 1, 1]);
    expect(tempBoard.countRunsLeft(true)).toEqual([2, 2, 1]);

    tempBoard.setShip([2, 0], GRAPHICAL_TYPES.LEFT);

    expect(tempBoard.countRunsLeft()).toEqual([2, 2, 0]);
    expect(tempBoard.countRunsLeft(true)).toEqual([2, 2, 0]);
});

test('getRuns', () => {
    expect(board1.getRuns()).toEqual([[17]]);
    expect(board1.getRuns(true)).toEqual([[17]]);

    const tempBoard = board1.copy()
        .setShip([0, 0], GRAPHICAL_TYPES.RIGHT)
        .setShip([1, 0], GRAPHICAL_TYPES.HORIZONTAL);

    expect(tempBoard.getRuns()).toEqual([[17], [0, 1]]);
    expect(tempBoard.getRuns(true)).toEqual([[17]]);

    tempBoard.setShip([2, 0], GRAPHICAL_TYPES.LEFT);

    expect(tempBoard.getRuns()).toEqual([[17], [0, 1, 2]]);
    expect(tempBoard.getRuns(true)).toEqual([[17], [0, 1, 2]]);
});

test('getHorizontalRuns', () => {
    expect(board1.getHorizontalRuns()[0]).toEqual([0, 1, 2, 3, 4, 5]);
    expect(board1.getHorizontalRuns(true, false, false)[0]).toEqual([0, 1, 2, 3, 4, 5]);
    expect(board1.getHorizontalRuns(true, true, false)).toEqual([]);

    const tempBoard = board1.copy()
        .setShip([0, 0], GRAPHICAL_TYPES.RIGHT)
        .setShip([1, 0], GRAPHICAL_TYPES.HORIZONTAL);

    expect(tempBoard.getHorizontalRuns(false, true, false)).toEqual([[0, 1]]);
    expect(tempBoard.getHorizontalRuns(true, true, false)).toEqual([]);
    expect(tempBoard.getHorizontalRuns(false, true, true)).toEqual([[0, 1], [17]]);
    expect(tempBoard.getHorizontalRuns(true, true, true)).toEqual([[17]]);

    tempBoard.setShip([2, 0], GRAPHICAL_TYPES.LEFT);

    expect(tempBoard.getHorizontalRuns(false, true, false)).toEqual([[0, 1, 2]]);
    expect(tempBoard.getHorizontalRuns(true, true, false)).toEqual([[0, 1, 2]]);
    expect(tempBoard.getHorizontalRuns(false, true, true)).toEqual([[0, 1, 2], [17]]);
    expect(tempBoard.getHorizontalRuns(true, true, true)).toEqual([[0, 1, 2], [17]]);
});

test('getRowRuns', () => {
    expect(() => { board1.getRowRuns(6); }).toThrow('outside of the board');

    // check if behavior with undefined squares is expected
    expect(board1.getRowRuns(2, true, true)).toEqual([[17]]);

    const tempBoard = board1.copy()
        .setShip([0, 0], GRAPHICAL_TYPES.RIGHT)
        .setShip([1, 0], GRAPHICAL_TYPES.HORIZONTAL);

    expect(tempBoard.getRowRuns(0, false, true)).toEqual([[0, 1]]);
    expect(tempBoard.getRowRuns(0, true, true)).toEqual([]);

    tempBoard.setShip([2, 0], GRAPHICAL_TYPES.LEFT);

    expect(tempBoard.getRowRuns(0, false, true)).toEqual([[0, 1, 2]]);
    expect(tempBoard.getRowRuns(0, true, true)).toEqual([[0, 1, 2]]);
});

test('getVerticalRuns', () => {
    expect(board1.getVerticalRuns()[0]).toEqual([0, 6, 12, 18, 24, 30]);
    expect(board1.getVerticalRuns(true, false, false)[0]).toEqual([0, 6, 12, 18, 24, 30]);
    expect(board1.getVerticalRuns(true, true, false)).toEqual([]);

    const tempBoard = board1.copy()
        .setShip([0, 0], GRAPHICAL_TYPES.DOWN)
        .setShip([0, 1], GRAPHICAL_TYPES.VERTICAL);

    expect(tempBoard.getVerticalRuns(false, true, false)).toEqual([[0, 6]]);
    expect(tempBoard.getVerticalRuns(true, true, false)).toEqual([]);
    expect(tempBoard.getVerticalRuns(false, true, true)).toEqual([[0, 6], [17]]);
    expect(tempBoard.getVerticalRuns(true, true, true)).toEqual([[17]]);

    tempBoard.setShip([0, 2], GRAPHICAL_TYPES.UP);

    expect(tempBoard.getVerticalRuns(false, true, false)).toEqual([[0, 6, 12]]);
    expect(tempBoard.getVerticalRuns(true, true, false)).toEqual([[0, 6, 12]]);
    expect(tempBoard.getVerticalRuns(false, true, true)).toEqual([[0, 6, 12], [17]]);
    expect(tempBoard.getVerticalRuns(true, true, true)).toEqual([[0, 6, 12], [17]]);
});

test('getColumnRuns', () => {
    expect(() => { board1.getColumnRuns(6); }).toThrow('must be within the board');

    // check if behavior with undefined squares is expected
    expect(board1.getColumnRuns(5, true, true)).toEqual([[17]]);

    const tempBoard = board1.copy()
        .setShip([0, 0], GRAPHICAL_TYPES.DOWN)
        .setShip([0, 1], GRAPHICAL_TYPES.VERTICAL);

    expect(tempBoard.getColumnRuns(0, false, true)).toEqual([[0, 6]]);
    expect(tempBoard.getColumnRuns(0, true, true)).toEqual([]);

    tempBoard.setShip([0, 2], GRAPHICAL_TYPES.UP);

    expect(tempBoard.getColumnRuns(0, false, true)).toEqual([[0, 6, 12]]);
    expect(tempBoard.getColumnRuns(0, true, true)).toEqual([[0, 6, 12]]);
});

test('computeGraphicalTypes', () => {
    const board = new BoardBuilder(6, 6)
        .setShip(0, GRAPHICAL_TYPES.RIGHT, true)
        .setShip(1, PLAY_TYPES.SHIP, true)
        .setShip(2, PLAY_TYPES.SHIP)
        .setShip([0, 5], PLAY_TYPES.SHIP)
        .setShip([1, 5], PLAY_TYPES.SHIP)
        .setShip([2, 5], PLAY_TYPES.SHIP)
        .setShip([3, 5], PLAY_TYPES.SHIP)
        .setShip([5, 5], PLAY_TYPES.SHIP)
        .setShip([5, 3], PLAY_TYPES.SHIP)
        .setShip([5, 2], PLAY_TYPES.SHIP)
        .setShip([5, 1], PLAY_TYPES.SHIP)
        .setShip([5, 0], PLAY_TYPES.SHIP)
        .softFloodColumn(4)
        .softFloodRow(4)
        .setShip([1, 2], GRAPHICAL_TYPES.RIGHT);

    expect(board.computeGraphicalTypes() instanceof BoardBuilder).toBeTruthy();

    expect(board.getShip(0).graphicalType).toBe(GRAPHICAL_TYPES.RIGHT);
    expect(board.getShip(1).graphicalType).toBe(GRAPHICAL_TYPES.HORIZONTAL);
    expect(board.getShip(2).graphicalType).toBe(GRAPHICAL_TYPES.SHIP);
    expect(board.getShip([0, 5]).graphicalType).toBe(GRAPHICAL_TYPES.RIGHT);
    expect(board.getShip([1, 5]).graphicalType).toBe(GRAPHICAL_TYPES.HORIZONTAL);
    expect(board.getShip([2, 5]).graphicalType).toBe(GRAPHICAL_TYPES.HORIZONTAL);
    expect(board.getShip([3, 5]).graphicalType).toBe(GRAPHICAL_TYPES.LEFT);
    expect(board.getShip([5, 5]).graphicalType).toBe(GRAPHICAL_TYPES.SINGLE);
    expect(board.getShip([5, 3]).graphicalType).toBe(GRAPHICAL_TYPES.UP);
    expect(board.getShip([5, 2]).graphicalType).toBe(GRAPHICAL_TYPES.VERTICAL);
    expect(board.getShip([5, 1]).graphicalType).toBe(GRAPHICAL_TYPES.VERTICAL);
    expect(board.getShip([5, 0]).graphicalType).toBe(GRAPHICAL_TYPES.DOWN);
    expect(board.getShip([1, 2]).graphicalType).toBe(GRAPHICAL_TYPES.SHIP);
});

test('coordinatesToIndex', () => {
    const board = new BoardBuilder(4, 4);
    expect(() => { board.coordinatesToIndex([4, 4]); }).toThrow('must be within board');
    expect(() => { board.coordinatesToIndex([3, 'e']); }).toThrow('must be integers');

    expect(board.coordinatesToIndex([3, 3])).toBe(15);
});

test('indexToCoordinates', () => {
    const board = new BoardBuilder(4, 4);
    expect(() => { board.indexToCoordinates(-1); }).toThrow('must be within the board');
    expect(() => { board.indexToCoordinates(16); }).toThrow('must be within the board');

    expect(board.indexToCoordinates(15)).toStrictEqual([3, 3]);
});

test('positionToIndex', () => {
    const board = new BoardBuilder(4, 4);
    expect(() => { board.positionToIndex(-1); }).toThrow('must be within the board');
    expect(() => { board.positionToIndex(16); }).toThrow('must be within the board');
    expect(() => { board.positionToIndex([-1, 0]); }).toThrow('must be within the board');
    expect(() => { board.positionToIndex([4, 3]); }).toThrow('must be within the board');
    expect(() => { board.positionToIndex('e'); }).toThrow('must be an index or array of coordinates');

    expect(board.positionToIndex(4)).toBe(4);
    expect(board.positionToIndex([0, 1])).toBe(4);
});

test('getShip', () => {
    const board = new BoardBuilder(4, 4);
    board.boardState[8] = new Ship(GRAPHICAL_TYPES.SINGLE, true);

    expect(board.getShip(8).graphicalType).toBe(GRAPHICAL_TYPES.SINGLE);
    expect(board.getShip(8).pinned).toBeTruthy();
});

test('setShip', () => {
    const board = new BoardBuilder(4, 4);
    board.setShip(0, GRAPHICAL_TYPES.DOWN);
    board.setShip(15, new Ship(GRAPHICAL_TYPES.RIGHT));

    expect(() => { board.setShip(8, 'ship'); }).toThrow('should be an instance of Ship or a ship type');
    expect(() => { board.setShip(8, PLAY_TYPES.SHIP, 'yes'); }).toThrow('expected pinned to be boolean');

    expect(board.boardState[0].graphicalType).toBe(GRAPHICAL_TYPES.DOWN);
    expect(board.boardState[15].graphicalType).toBe(GRAPHICAL_TYPES.RIGHT);
    expect(board.setShip(5, PLAY_TYPES.SHIP) instanceof BoardBuilder).toBeTruthy();
});

test('softSetShip', () => {
    const board = new BoardBuilder(4, 4);

    expect(board.softSetShip(7, GRAPHICAL_TYPES.HORIZONTAL)).toBeTruthy();
    expect(board.boardState[7].graphicalType).toBe(GRAPHICAL_TYPES.HORIZONTAL);
    expect(board.softSetShip(7, GRAPHICAL_TYPES.LEFT)).toBeFalsy();
    expect(board.boardState[7].graphicalType).toBe(GRAPHICAL_TYPES.HORIZONTAL);
});

test('relativePositionToIndex', () => {
    const board = new BoardBuilder(4, 4);

    expect(board.relativePositionToIndex(0, RELATIVE_POSITIONS.RIGHT)).toBe(1);
    expect(board.relativePositionToIndex(0, RELATIVE_POSITIONS.LEFT)).toBeNull();
    expect(board.relativePositionToIndex(3, RELATIVE_POSITIONS.RIGHT)).toBeNull();
});

test('getRelativeShip', () => {
    const board = new BoardBuilder(4, 4);
    board.setShip(0, PLAY_TYPES.SHIP);
    board.setShip(1, PLAY_TYPES.WATER);
    board.setShip(4, GRAPHICAL_TYPES.VERTICAL);

    expect(board.getRelativeShip(0, RELATIVE_POSITIONS.BOTTOM).graphicalType).toBe(GRAPHICAL_TYPES.VERTICAL);
    expect(board.getRelativeShip(0, RELATIVE_POSITIONS.LEFT)).toBeNull();
    expect(board.getRelativeShip(0, RELATIVE_POSITIONS.RIGHT).playType).toBe(PLAY_TYPES.WATER);
});

test('setRelativeShip', () => {
    const board = new BoardBuilder(4, 4);

    expect(board.setRelativeShip(0, RELATIVE_POSITIONS.RIGHT, PLAY_TYPES.SHIP) instanceof BoardBuilder).toBeTruthy();
    expect(board.setRelativeShip(0, RELATIVE_POSITIONS.LEFT, PLAY_TYPES.SHIP)).toBeNull();
    expect(board.boardState[1].playType).toBe(PLAY_TYPES.SHIP);
});

test('setCardinalShips', () => {
    const board = new BoardBuilder(4, 4);
    expect(board.setCardinalShips([1, 1], RELATIVE_POSITIONS.TOP) instanceof BoardBuilder).toBeTruthy();

    expect(board.boardState[0].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[1].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[2].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[4].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[6].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[8].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[9].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[10].playType).toBe(PLAY_TYPES.WATER);
});

test('setOrthogonalShips', () => {
    const board = new BoardBuilder(4, 4);
    expect(board.setOrthogonalShips([1, 1], GRAPHICAL_TYPES.VERTICAL) instanceof BoardBuilder).toBeTruthy();

    expect(board.boardState[0].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[1].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[2].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[4].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[6].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[8].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[9].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[10].playType).toBe(PLAY_TYPES.WATER);
});

test('floodColumn', () => {
    const board = new BoardBuilder(4, 4);

    expect(board.softFloodColumn(0) instanceof BoardBuilder).toBeTruthy();
    expect(board.boardState[0].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[4].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[8].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[12].playType).toBe(PLAY_TYPES.WATER);

    expect(board.softFloodColumn(3, PLAY_TYPES.SHIP) instanceof BoardBuilder).toBeTruthy();
    expect(board.boardState[3].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[7].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[11].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[15].playType).toBe(PLAY_TYPES.SHIP);
});

test('floodRow', () => {
    const board = new BoardBuilder(4, 4);

    expect(board.softFloodRow(0) instanceof BoardBuilder).toBeTruthy();
    expect(board.boardState[0].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[1].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[2].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[3].playType).toBe(PLAY_TYPES.WATER);

    expect(board.softFloodRow(3, PLAY_TYPES.SHIP) instanceof BoardBuilder).toBeTruthy();
    expect(board.boardState[12].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[13].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[14].playType).toBe(PLAY_TYPES.SHIP);
    expect(board.boardState[15].playType).toBe(PLAY_TYPES.SHIP);
});

test('floodCorners', () => {
    const board = new BoardBuilder(4, 4);

    expect(board.floodCorners([1, 1]) instanceof BoardBuilder).toBeTruthy();
    expect(board.boardState[0].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[2].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[8].playType).toBe(PLAY_TYPES.WATER);
    expect(board.boardState[10].playType).toBe(PLAY_TYPES.WATER);
});

test('base64 export/import', () => {
    const board = new BoardBuilder(2, 2, undefined, [2, 0], [1, 1], [0, 1])
        .setShip(0, GRAPHICAL_TYPES.DOWN)
        .setShip(2, GRAPHICAL_TYPES.UP);
    const b64 = board.export();
    const importedBoard = new BoardBuilder(b64);

    expect(importedBoard.sameBoardState(board)).toBeTruthy();
    expect(importedBoard.columnCounts).toEqual(board.columnCounts);
    expect(importedBoard.rowCounts).toEqual(board.rowCounts);
    expect(importedBoard.runs).toEqual(board.runs);

    const board2 = new BoardBuilder(2, 2)
        .setShip(0, GRAPHICAL_TYPES.DOWN)
        .setShip(2, GRAPHICAL_TYPES.UP);
    const board2B64 = board2.export();
    const importedBoard2 = new BoardBuilder(board2B64);

    expect(importedBoard2.sameBoardState(board2)).toBeTruthy();
    expect(importedBoard2.columnCounts).toEqual([0, 0]);
    expect(importedBoard2.rowCounts).toEqual([0, 0]);
    expect(importedBoard2.runs).toEqual([0]);

    const board3 = new BoardBuilder(16, 16)
        .setShip([2, 0], GRAPHICAL_TYPES.SINGLE, true)
        .setShip([6, 4], PLAY_TYPES.WATER);
    const board3B64 = board3.export();
    const importedBoard3 = BoardBuilder.b64ToBoard(board3B64);

    expect(importedBoard3.sameBoardState(board3)).toBeTruthy();
});
