import { TYPES } from '../logic/Ship';
import { typeToJSX } from './BoardUI';
import { b64ToURLSafe } from '../logic/BoardUtils';
import InnerBoard from './shared/InnerBoard';

import type { JSX } from 'react';
import type { PlayParams } from './shared/Mode';

export default function PlayUI ({ board, setBoard, initialBoard, SQUARE_SIZE, undo, redo, solved, toggleMode }: PlayParams): JSX.Element {
    function solveBoard (): void {
        const newBoard = board.solve();
        setBoard(newBoard);
    }

    function reset (): void {
        const newBoard = initialBoard.copy();
        setBoard(newBoard);
    }

    function share (): void {
        const url = `${window.location.origin}/?board=${
            b64ToURLSafe(board.export())
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
                    style={{ gridTemplate: `auto / repeat(${board.width}, ${SQUARE_SIZE}px)` }}
                >
                    {displayCounts(false) /* false = columns */}
                </div>
                <span />

                <div
                    className='Row Counts'
                    style={{ gridTemplate: `repeat(${board.height}, ${SQUARE_SIZE}px) / auto` }}
                >
                    {displayCounts(true) /* true = rows */}
                </div>
                <InnerBoard board={board} setBoard={setBoard} solved={solved} isEditMode={false} />
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
                    <button onClick={() => { undo(); }}>Undo</button>
                    <button onClick={() => { redo(); }}>Redo</button>
                    <button onClick={() => { share(); }}> Share</button>
                    <button onClick={() => { toggleMode(); }}> Edit </button>
                </div>
                <span />
            </div>
        </div>
    );
}
