'use client';

import { Component } from 'react';
import { TYPES } from '../logic/Ship';
import Board from '../logic/Board';

import PlayUI from './PlayUI';
// import EditUI from './edit/EditUI';

import './css/BoardUI.css';
import './css/Ships.css';

import type { JSX } from 'react';
import type { AnyType, GraphicalType } from '../logic/Ship';

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
    draggedType: AnyType | undefined;
    draggedButton: number;
}

export default class BoardUI extends Component<Props, State> {
    readonly #initialBoard: Board;
    readonly SIZE = 50; // px

    constructor (props: Props) {
        super(props);

        let board;

        if (this.props.board) board = Board.from(this.props.board);
        else if (this.props.width && this.props.height) {
            if (this.props.colCounts && this.props.rowCounts && this.props.runs) {
                board = new Board(this.props.width, this.props.height, this.props.colCounts, this.props.rowCounts, this.props.runs);
            } else {
                board = new Board(this.props.width, this.props.height);
            }
        } else if (this.props.preset instanceof Board) {
            if (this.props.colCounts && this.props.rowCounts && this.props.runs) {
                board = new Board(this.props.preset, this.props.colCounts, this.props.rowCounts, this.props.runs);
            } else {
                board = new Board(this.props.preset);
            }
        } else throw new Error('Invalid props');

        this.#initialBoard = board.copy();

        this.state = {
            board: board,
            solved: board.isSolved(),
            draggedType: undefined,
            draggedButton: 0,
        };
    }

    render (): JSX.Element {
        return (
            <PlayUI
                board={this.state.board}
                setBoard={(newBoard: Board) => { this.setState({ board: newBoard }); }}
                initialBoard={this.#initialBoard}
                SQUARE_SIZE={50} /* px */
            />
        );
    }
}

export function typeToJSX (type: GraphicalType, key: number): JSX.Element | undefined {
    switch (type) {
        case TYPES.UNKNOWN:
            return;
        case TYPES.SINGLE:
            return <div className='Ship Single' key={key} />;
        case TYPES.UP:
            return <div className='Ship Up' key={key} />;
        case TYPES.RIGHT:
            return <div className='Ship Right' key={key} />;
        case TYPES.LEFT:
            return <div className='Ship Left' key={key} />;
        case TYPES.DOWN:
            return <div className='Ship Down' key={key} />;
        case TYPES.SHIP:
            return <div className='Ship UnknownShip' key={key} />;
        case TYPES.ORTHOGONAL:
            return <div className='Ship Orthogonal' key={key} />;
        case TYPES.WATER:
            return <div className='Ship Water' key={key} />;
    }
}
