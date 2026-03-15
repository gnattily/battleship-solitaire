import { useState, type JSX } from 'react';
import type { TemplateParams } from './Mode';
import { typeToJSX } from '../BoardUI';
import { TYPES } from '../../logic/Ship';
import InnerBoard from './InnerBoard';

export default function Template ({
    board,
    setBoard,
    SQUARE_SIZE,
    editMode,
    buttons,
    onClickRuns,
    extraColCountEl,
    extraRowCountEl,
}: TemplateParams): JSX.Element {
    const [solved, setSolved] = useState(board.isSolved());

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

    return (
        <div className='Board'>
            <div className='Content'>
                <span />
                <div
                    className='Column Counts'
                    style={{ gridTemplate: `auto / repeat(${board.width + (!!extraColCountEl ? 1 : 0)}, ${SQUARE_SIZE}px)` }}
                >
                    {displayCounts(false)}
                    {extraColCountEl}
                </div>
                <span />

                <div
                    className='Row Counts'
                    style={{ gridTemplate: `repeat(${board.width + (!!extraRowCountEl ? 1 : 0)}, ${SQUARE_SIZE}px) / auto` }}
                >
                    {displayCounts(true) /* true = rows */}
                    {extraRowCountEl}
                </div>
                <InnerBoard board={board} setBoard={setBoard} solved={solved} setSolved={setSolved} isEditMode={editMode} />
            </div>
            <div
                className='Runs'
                style={{ height: board.height * SQUARE_SIZE + board.height + 1 + 'px' }}
                onClick={() => { onClickRuns?.(); }}
            >
                {displayRuns()}
            </div>

            <span />
            <div className='Buttons'>
                {buttons}
            </div>
            <span />
        </div>
    );
}
