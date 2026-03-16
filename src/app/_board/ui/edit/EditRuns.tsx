import { useRef } from 'react';
import { renderRun } from './EditUI';

import type { JSX } from 'react';
import type Board from '../../logic/Board';

type Params = {
    board: Board;
    setBoard: (board: Board) => void;
    del: () => void;
};

export default function EditRuns ({ board, setBoard, del }: Params): JSX.Element {
    const lengthInputs = useRef<(HTMLInputElement | null)[]>([]);

    function renderSpans (): JSX.Element[] {
        const out = [];

        for (let i = 0; i < Math.max(board.width, board.height); i++) {
            out.push(
                <span key={i}>
                    <span className='Run'>
                        {renderRun(i + 1)}
                    </span>
                    <input
                        ref={el => { lengthInputs.current[i] = el; }}
                        type='number'
                        min={0}
                        defaultValue={board.runs[i] || 0}
                        onFocus={e => e.target.select()}
                    />
                </span>,
            );
        }

        return out;
    }

    function submit (): void {
        const runs = [] as number[];

        lengthInputs.current.forEach((input, index) => {
            if (!input) throw ReferenceError;
            const val = parseInt(input.value);
            if (val >= 0) runs.push(val);
            else runs.push(board.runs[index]);
        });

        board.runs = runs;
        setBoard(board);
        del();
    }

    function onBlur (e: React.FocusEvent<HTMLDivElement>): void {
        if (!e.currentTarget.contains(e.relatedTarget)) submit();
    }

    return (
        <div
            className='EditRuns'
            onBlur={onBlur}
        >
            <p onClick={submit}>X</p>
            <div
                // make this Math.max thing a property of Board -TODO
                style={{ gridTemplateColumns: `repeat(${Math.max(board.width, board.height)}, auto)` }}
            >
                {renderSpans()}
            </div>
        </div>
    );
}
