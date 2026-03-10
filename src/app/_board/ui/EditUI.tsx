import { useState } from 'react';
import { TYPES } from '../logic/Ship';
import { typeToJSX } from './BoardUI';

import type { JSX } from 'react';
import InnerBoard from './shared/InnerBoard';
import type { EditParams } from './shared/Mode';
import Board from '../logic/Board';

export default function EditUI ({ board, setBoard, SQUARE_SIZE, toggleMode }: EditParams): JSX.Element {
    const [solved, setSolved] = useState(board.isSolved());

    function solveBoard (): void {
        const newBoard = board.solve();
        setBoard(newBoard);
        setSolved(newBoard.isSolved());
    }

    function reset (): void {
        const newBoard = new Board(
            board.width,
            board.height,
            new Array(board.width).fill(0),
            new Array(board.height).fill(0),
            [],
        );
        setBoard(newBoard);
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

    // move the majority of this logic to template if at all possible
    function displayCounts (rows: boolean): JSX.Element[] {
        return (rows ? board.rowCounts : board.colCounts).map((count, index) => (
            <p
                key={index}
                onClick={() => { inputCount(rows, index); }}
            >
                {count}
            </p>
        ));
    }

    function inputCount (rows: boolean, index: number): void {
        const newCount = Number(prompt('New count', '0'));

        if (false
            || !Number.isInteger(newCount)
            || newCount < 0
            || newCount > board[rows ? 'width' : 'height']
        ) return alert('Invalid input');

        const newBoard = board.copy();
        newBoard[rows ? 'rowCounts' : 'colCounts'][index] = newCount;
        setBoard(newBoard);
    }

    // make this clickable to edit w/ popup
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
                <InnerBoard board={board} setBoard={setBoard} solved={solved} setSolved={setSolved} isEditMode={true} />
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
                    <button onClick={() => { toggleMode(); }}> Edit </button>
                    {/* Add an undo button on this an the Play UI */}
                </div>
                <span />
            </div>
        </div>
    );
}
