import type { JSX } from 'react';
import type Board from '../../logic/Board';

export type CommonParams = {
    board: Board;
    setBoard: (newBoard: Board) => void;
    SQUARE_SIZE: number;
};

export type PlayParams = CommonParams & {
    initialBoard: Board;
    toggleMode: () => void;
};

export type EditParams = CommonParams & {
    toggleMode: () => void;
};

export type TemplateParams = CommonParams & {
    editMode: boolean;
    buttons: JSX.Element[];
    onClickColCount: () => void;
    onClickRowCount: () => void;
    onClickRuns?: () => void;
    extraRowCountEl?: JSX.Element;
    extraColCountEl?: JSX.Element;
};

// () => {
//     const newBoard = rows ? board.softFloodRow(index) : board.softFloodCol(index);
//     newBoard.compTypes();
//     setBoard(newBoard);
//     setSolved(newBoard.isSolved());
// };
