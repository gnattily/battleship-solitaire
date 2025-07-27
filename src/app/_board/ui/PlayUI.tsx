import { useState } from 'react';
import { TYPES } from '../logic/Ship';
import { typeToJSX } from './BoardUI';

import type Board from '../logic/Board';
import type { JSX } from 'react';
import InnerBoard from './InnerBoard';

type Params = {
    board: Board;
    setBoard: (newBoard: Board) => void;
    initialBoard: Board;
    SQUARE_SIZE: number;
};

export default function PlayUI ({ board, setBoard, initialBoard, SQUARE_SIZE }: Params): JSX.Element {
    const [solved, setSolved] = useState(board.isSolved());

    function solveBoard (): void {
        const newBoard = board.solve();
        setBoard(newBoard);
        setSolved(newBoard.isSolved());
    }

    function reset (): void {
        const newBoard = initialBoard.copy();
        setBoard(newBoard);
        setSolved(newBoard.isSolved());
    }

    function share (): void {
        const url = `${window.location.origin}/?board=${
            board.export()
                .replaceAll('+', '-')
                .replaceAll('/', '_')
                .replaceAll('=', '')
        }`;

        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy link. Copy manually: ' + url);
        });
    }

    function displayCounts (rows: boolean): JSX.Element[] {
        return (rows ? board.rowCounts : board.colCounts).map((count, index) => (
            <p
                key={index}
                onClick={() => {
                    const newBoard = rows ? board.softFloodRow(index) : board.softFloodCol(index);
                    newBoard.compTypes();
                    setBoard(newBoard);
                    setSolved(newBoard.isSolved());
                }}
            >
                {count}
            </p>
        ));
    }

    function displayRuns (): JSX.Element[] {
        // create all runs from this.state.board.runs
        // all ships should be grayed out by default
        // runsDiff[i] of them should be not grayed out
        // if runsDiff[i] is negative, they should all be red
        const out = [];
        const counts = board.countRunsLeft(true);

        let key = 0;
        for (let i = board.runs.length - 1; i >= 0; i--) {
            for (let j = 0; j < board.runs[i]; j++) {
                const classes = 'Run' + (counts[i] < 0 ? ' over' : '') + ((j < counts[i]) ? '' : ' desaturated');
                out.push(
                    <span className={classes} key={key}>
                        {renderRun(i + 1)}
                    </span>,
                );
                key++;
            }
        }

        return out;
    }

    function renderRun (length: number): (JSX.Element | undefined)[] {
        if (length === 1) return [typeToJSX(TYPES.SINGLE, 0)];

        const out = [typeToJSX(TYPES.DOWN, 0)];

        for (let i = 0; i < length - 2; i++) {
            out.push(typeToJSX(TYPES.ORTHOGONAL, i + 1));
        }

        return [...out, typeToJSX(TYPES.UP, out.length)];
    }

    // Content div is unnecessary, but has all the styling.
    // Remove Board div and rename Content to Board. -TODO
    return (
        <div className='Board'>
            <div className='Content'>
                <span />
                <div
                    className='Column Counts'
                    style={{ gridTemplate: `auto / repeat(${board.height}, ${SQUARE_SIZE}px)` }}
                >
                    {displayCounts(false) /* false = columns */}
                </div>
                <span />

                <div
                    className='Row Counts'
                    style={{ gridTemplate: `repeat(${board.width}, ${SQUARE_SIZE}px) / auto` }}
                >
                    {displayCounts(true) /* true = rows */}
                </div>
                <InnerBoard board={board} setBoard={setBoard} solved={solved} setSolved={setSolved} isEditMode={false} />
                <div
                    className='Runs'
                    style={{ height: board.height * SQUARE_SIZE + board.height + 1 + 'px' }}
                >
                    {displayRuns()}
                </div>

                <span />
                <div className='Buttons'>
                    <button onClick={() => { solveBoard(); }}> Solve </button>
                    <button onClick={() => { reset(); }}> Reset </button>
                    <button onClick={() => { share(); }}> Share</button>
                    <button onClick={() => { /* this.edit(); */ }}> Edit </button>
                </div>
                <span />
            </div>
        </div>
    );
}
