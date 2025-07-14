import './global.css';
import BoardUI from './_board/ui/BoardUI';
import Board from './_board/Board';
import { TYPE } from './_board/Ship';
import type { JSX } from 'react';

// https://www.brainbashers.com/showbattleships.asp?date=0227&size=6&puzz=A
// const preset = new Board(6, 6)
//     .setShip([0, 5], TYPE.WATER, true)
//     .setShip([4, 3], TYPE.SINGLE, true);

// colCounts={[1, 1, 4, 0, 4, 0]} rowCounts={[2, 2, 2, 1, 0, 3]

// const preset = new Board(12, 12).setShip(3, 1, false).setShip(9, 6, false).setShip(10, 9, false).setShip(13, 2, false).setShip(23, 1, false).setShip(27, 1, false).setShip(31, 1, false).setShip(68, 1, false).setShip(72, 1, false).setShip(73, 1, false).setShip(74, 1, false).setShip(84, 1, false).setShip(85, 3, false).setShip(86, 1, false).setShip(90, 1, false).setShip(91, 5, false).setShip(92, 9, false).setShip(94, 1, false).setShip(95, 1, false).setShip(96, 1, false).setShip(97, 1, false).setShip(98, 1, false).setShip(106, 1, false).setShip(107, 3, false).setShip(118, 1, false).setShip(119, 1, false).setShip(126, 1, false).setShip(127, 5, false).setShip(128, 9, false);
// colCounts={[0, 3, 1, 3, 1, 1, 5, 2, 2, 3, 3, 3]} rowCounts={[2, 5, 1, 5, 1, 1, 3, 4, 1, 0, 3, 1]}

// https://www.brainbashers.com/showbattleships.asp?date=0607&size=15&puzz=A
const board = new Board(15, 15,
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
    .setShip([10, 4], TYPE.ORTHOGONAL, true)
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
    .setShip([14, 14], TYPE.SINGLE, true)
    .export();

const board2 = new Board(15, 15,
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
    .setShip([12, 13], TYPE.SINGLE, true)
    .export();

export default function Page (): JSX.Element {
    return (
        <>
            <BoardUI
                board={board}
            />
            <BoardUI
                board={board2}
            />
        </>
    );
}
