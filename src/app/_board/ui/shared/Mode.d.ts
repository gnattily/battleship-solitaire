import type Board from '../../logic/Board';

export type CommonParams = {
    board: Board;
    setBoard: (newBoard: Board) => void;
    SQUARE_SIZE: number;
    undo: () => void;
    redo: () => void;
    solved: boolean;
};

export type PlayParams = CommonParams & {
    initialBoard: Board;
    toggleMode: () => void;
};

export type EditParams = CommonParams & {
    toggleMode: () => void;
};
