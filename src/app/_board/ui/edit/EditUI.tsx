import { useState } from 'react';
import { TYPES } from '../../logic/Ship';
import { typeToJSX } from '../BoardUI';
import InnerBoard from '../shared/InnerBoard';
import Board from '../../logic/Board';
import SetNum from './SetNum';

import type { JSX } from 'react';
import type { EditParams } from '../shared/Mode';
import EditRuns from './EditRuns';

export default function EditUI ({ board, setBoard, SQUARE_SIZE, toggleMode }: EditParams): JSX.Element {
    const [solved, setSolved] = useState(board.isSolved());
    const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);
    const [editingRuns, setEditingRuns] = useState(false);

    // 0 = editing width, 1 = editing height, undefined = not editing
    const [editingDimension, setEditingDimension] = useState<undefined | 0 | 1>();

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

    function displayCounts (rows: boolean): JSX.Element[] {
        return (rows ? board.rowCounts : board.colCounts).map((count, index) => {
            if (index + (rows ? board.width : 0) === editingIndex) {
                return (
                    <SetNum
                        key={index}
                        initNum={count}
                        max={rows ? board.width : board.height}
                        min={0}
                        updateNum={updatedCount => {
                            (rows ? board.rowCounts : board.colCounts)[index] = updatedCount;
                            setBoard(board);
                        }}
                        del={() => setEditingIndex(undefined)}
                    />
                );
            } else {
                return (
                    <p
                        key={index}
                        onClick={() => { setEditingIndex(index + (rows ? board.width : 0)); }}
                    >
                        {count}
                    </p>
                );
            }
        });
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

    function dimension (width: boolean): JSX.Element {
        if (editingDimension === 0 && width) {
            return (
                <SetNum
                    initNum={board.width}
                    max={32}
                    min={1}
                    updateNum={updatedDimension => {
                        board.width = updatedDimension;
                        setBoard(board);
                    }}
                    del={() => { setEditingDimension(undefined); }}
                />
            );
        } if (editingDimension === 1 && !width) {
            return (
                <SetNum
                    initNum={board.height}
                    max={32}
                    min={1}
                    updateNum={updatedDimension => {
                        board.height = updatedDimension;
                        setBoard(board);
                    }}
                    del={() => { setEditingDimension(undefined); }}
                />
            );
        } else {
            return (
                <p
                    className={width ? 'width' : 'height'}
                    onClick={() => { setEditingDimension(width ? 0 : 1); alert(`${width}, ${editingDimension}`); }}
                >
                    {width ? board.width : board.height}
                </p>
            );
        }
    }

    return (
        <>
            <div className='Board' key={0}>
                <div className='Content'>
                    <span />
                    <div
                        className='Column Counts'
                        style={{ gridTemplate: `auto / repeat(${board.height}, ${SQUARE_SIZE}px)` }}
                    >
                        {displayCounts(false) /* false = columns */}
                    </div>
                    {dimension(true)}

                    <div
                        className='Row Counts'
                        style={{ gridTemplate: `repeat(${board.width}, ${SQUARE_SIZE}px) / auto` }}
                    >
                        {displayCounts(true) /* true = rows */}
                    </div>
                    <InnerBoard board={board} setBoard={setBoard} solved={solved} setSolved={setSolved} isEditMode={true} />
                    <div
                        onClick={() => { setEditingRuns(true); }}
                        className='Runs'
                        style={{ height: board.height * SQUARE_SIZE + board.height + 1 + 'px' }}
                    >
                        {displayRuns()}
                    </div>

                    {dimension(false)}
                    <div className='Buttons'>
                        <button onClick={() => { solveBoard(); }}> Solve </button>
                        <button onClick={() => { reset(); }}> Reset </button>
                        <button onClick={() => { share(); }}> Share</button>
                        <button onClick={() => { toggleMode(); }}> Play </button>
                        {/* Add undo/redo buttons on this an the Play UI */}
                    </div>
                    <span />
                </div>
            </div>
            {editingRuns && <EditRuns board={board} setBoard={setBoard} del={() => { setEditingRuns(false); }} />}
        </>
    );
}

export function renderRun (length: number): (JSX.Element | undefined)[] {
    if (length === 1) return [typeToJSX(TYPES.SINGLE, 0)];

    const out = [typeToJSX(TYPES.DOWN, 0)];

    if (length <= 5) {
        for (let i = 0; i < length - 2; i++) {
            out.push(typeToJSX(TYPES.ORTHOGONAL, i + 1));
        }
    } else {
        out.push(
            <p key={1} className='ellipsis'>...</p>,
            <p key={2} className='length'>{length}</p>,
            <p key={3} className='ellipsis'>...</p>,
        );
    }

    return [...out, typeToJSX(TYPES.UP, out.length)];
}
