'use client';

import { Component } from 'react';
import { TYPES } from '../logic/Ship';
import Board from '../logic/Board';

import PlayUI from './PlayUI';
import EditUI from './edit/EditUI';

import './css/BoardUI.css';
import './css/Ships.css';

import type { JSX } from 'react';
import type { GraphicalType } from '../logic/Ship';

interface Props {
    board?: string;
    width?: number;
    height?: number;
    preset?: Board;
    colCounts?: number[];
    rowCounts?: number[];
    runs?: number[];
}

interface State {
    board: Board;
    solved: boolean;
    editMode: boolean;
}

export default class BoardUI extends Component<Props, State> {
    readonly #initialBoard: Board;
    readonly SIZE = 50; // px
    history: Board[] = [];
    historyIndex = 0;

    constructor (props: Props) {
        super(props);

        let board;
        const hasSolveData = this.props.colCounts && this.props.rowCounts && this.props.runs;

        // full board already provided
        if (this.props.board) board = Board.from(this.props.board);

        // new empty board
        else if (this.props.width && this.props.height) {
            if (hasSolveData)
                board = new Board(this.props.width, this.props.height, this.props.colCounts, this.props.rowCounts, this.props.runs);
            else board = new Board(this.props.width, this.props.height);

        // board from preset
        } else if (this.props.preset instanceof Board) {
            if (hasSolveData)
                board = new Board(this.props.preset, this.props.colCounts, this.props.rowCounts, this.props.runs);
            else board = new Board(this.props.preset);
        } else throw new Error('Invalid props');

        this.#initialBoard = board.copy();

        this.state = {
            board: board,
            solved: board.isSolved(),
            editMode: false,
        };

        this.history.push(board.copy());
    }

    // arrow declaration to bind this properly
    toggleMode = (): void => {
        this.setState({
            editMode: !this.state.editMode,
        });
    };

    setBoard = (newBoard: Board): void => {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(newBoard.copy());
        this.historyIndex++;
        this.setState({ board: newBoard, solved: newBoard.isSolved() });
    };

    undo = (): void => {
        this.historyIndex = Math.max(this.historyIndex - 1, 0);
        const newBoard = this.history[this.historyIndex].copy();
        this.setState({ board: newBoard, solved: newBoard.isSolved() });
    };

    redo = (): void => {
        this.historyIndex = Math.min(this.history.length - 1, this.historyIndex + 1);
        const newBoard = this.history[this.historyIndex].copy();
        this.setState({ board: newBoard, solved: newBoard.isSolved() });
    };

    render (): JSX.Element {
        if (this.state.editMode) return (
            <EditUI
                board={this.state.board}
                setBoard={this.setBoard}
                SQUARE_SIZE={50} // px
                toggleMode={this.toggleMode}
                undo={this.undo}
                redo={this.redo}
                solved={this.state.solved}
            />
        ); else return (
            <PlayUI
                board={this.state.board}
                setBoard={this.setBoard}
                initialBoard={this.#initialBoard}
                SQUARE_SIZE={50} /* px */
                toggleMode={this.toggleMode}
                undo={this.undo}
                redo={this.redo}
                solved={this.state.solved}
            />
        );
    }
}

export function typeToJSX (type: GraphicalType, key: number): JSX.Element | undefined {
    switch (type) {
        case TYPES.UNKNOWN: return;
        case TYPES.SINGLE: return <div className='Ship Single' key={key} />;
        case TYPES.UP: return <div className='Ship Up' key={key} />;
        case TYPES.RIGHT: return <div className='Ship Right' key={key} />;
        case TYPES.LEFT: return <div className='Ship Left' key={key} />;
        case TYPES.DOWN: return <div className='Ship Down' key={key} />;
        case TYPES.SHIP: return <div className='Ship UnknownShip' key={key} />;
        case TYPES.ORTHOGONAL: return <div className='Ship Orthogonal' key={key} />;
        case TYPES.WATER: return <div className='Ship Water' key={key} />;
    }
}
