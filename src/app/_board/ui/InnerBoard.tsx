import { useState } from 'react';
import { TYPES, PLAY_TYPE_COUNT, GRAPHICAL_TYPE_COUNT } from '../logic/Ship';
import { typeToJSX } from './BoardUI';

import type Board from '../logic/Board';
import type { JSX } from 'react';
import type { AnyType } from '../logic/Ship';

type Params = {
    board: Board;
    setBoard: (newBoard: Board) => void;
    solved: boolean;
    setSolved: (isSolved: boolean) => void;
    isEditMode: boolean;
};

export default function InnerBoard ({ board, setBoard, solved, setSolved, isEditMode }: Params): JSX.Element {
    const [draggedType, setDraggedType] = useState<AnyType | undefined>(undefined);
    const [draggedButton, setDraggedButton] = useState<number | undefined>(undefined);

    function onMouseDown (event: React.MouseEvent, index: number): void {
        const ship = board.getShip(index);

        if (ship.pinned) return;
        if (event.button !== 0 && event.button !== 2) return;

        let newType;
        const diff = event.button === 0 ? 1 : -1;

        if (isEditMode) {
            newType = (ship.graphicalType + GRAPHICAL_TYPE_COUNT + diff) % GRAPHICAL_TYPE_COUNT;
        } else {
            newType = (ship.playType + PLAY_TYPE_COUNT + diff) % PLAY_TYPE_COUNT;
        }

        const newBoard = board.setShip(index, newType as AnyType);
        if (!isEditMode) newBoard.compTypes();

        setBoard(newBoard);
        setSolved(newBoard.isSolved());
        setDraggedType(newType as AnyType);
        setDraggedButton(event.buttons);
    }

    function onMouseEnter (index: number): void {
        if (draggedType === undefined || board.getShip(index).pinned) return;

        const newBoard = board.setShip(index, draggedType).compTypes();
        setBoard(newBoard);
        setSolved(newBoard.isSolved());
    }

    function onEnterBoard (event: React.MouseEvent): void {
        if (!draggedButton || draggedButton !== event.buttons) {
            setDraggedType(undefined);
            setDraggedButton(undefined);
            event.stopPropagation();
        }
    }

    function onMouseUp (): void {
        setDraggedType(undefined);
        setDraggedButton(undefined);
    }

    return (
        <div
            className={'Inner' + (solved ? ' Solved' : '')}
            style={{ gridTemplate: `repeat(${board.width}, 50px) / repeat(${board.height}, 50px)` }}
            onMouseEnter={e => onEnterBoard(e)}
        >
            {
                board.state.map((ship, index) => {
                    return (
                        <div
                            className='Square nohighlight'
                            key={index}
                            onMouseDown={event => onMouseDown(event, index)}
                            onMouseEnter={() => onMouseEnter(index)}
                            onMouseUp={() => onMouseUp()}
                            onContextMenu={e => e.preventDefault()}
                        >
                            {
                                typeToJSX(solved && ship.playType === TYPES.WATER
                                    ? TYPES.UNKNOWN
                                    : ship.graphicalType,
                                index)
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}
