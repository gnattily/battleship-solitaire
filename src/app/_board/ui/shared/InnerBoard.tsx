import { useState } from 'react';
import { TYPES, PLAY_TYPE_COUNT, GRAPHICAL_TYPE_COUNT } from '../../logic/Ship';
import { typeToJSX } from '../BoardUI';

import type Board from '../../logic/Board';
import type { JSX } from 'react';
import type { AnyType } from '../../logic/Ship';

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

        if (isEditMode
            && ship.playType !== TYPES.UNKNOWN
            && event.button === 1
        ) {
            board.setShip(index, ship.graphicalType, !ship.pinned);
            return setBoard(board);
        }

        if (!isEditMode && ship.pinned) return;
        if (event.button !== 0 && event.button !== 2) return;

        let newType;
        const diff = event.button === 0 ? 1 : -1;

        newType = isEditMode
            ? (ship.graphicalType + GRAPHICAL_TYPE_COUNT + diff) % GRAPHICAL_TYPE_COUNT
            : (ship.playType + PLAY_TYPE_COUNT + diff) % PLAY_TYPE_COUNT;

        board.setShip(index, newType as AnyType, isEditMode && newType !== TYPES.UNKNOWN);
        if (!isEditMode) board.compTypes();

        setBoard(board);
        setSolved(board.isSolved());
        setDraggedType(newType as AnyType);
        setDraggedButton(event.buttons);
    }

    function onMouseEnter (index: number): void {
        if (draggedType === undefined || board.getShip(index).pinned) return;

        board.setShip(index, draggedType, isEditMode && draggedType !== TYPES.UNKNOWN);
        if (!isEditMode) board.compTypes();
        setBoard(board);
        setSolved(board.isSolved());
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
            style={{ gridTemplate: `repeat(${board.height}, 50px) / repeat(${board.width}, 50px)` }}
            onMouseEnter={e => onEnterBoard(e)}
        >
            {
                board.state.map((ship, index) => {
                    return (
                        <div
                            // giving every square the same classes feels unnecessary -TODO
                            className={`Square nohighlight ${isEditMode && ship.pinned ? 'pinned' : ''}`}
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
