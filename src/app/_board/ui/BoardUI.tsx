'use client';

import type { ReactElement, ReactNode } from 'react';
import type { AnyType, GraphicalType, PlayType } from '../Ship';

import React, { Component } from 'react';
import Image from 'next/image';

import Board from '../Board';
import { TYPE } from '../Ship';

import './BoardUI.css';

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

/**
 * The visible board
 * @param {string} board The exported board
 * @param {number} width Width in squares
 * @param {number} height Height in squares
 * @param {Board} [preset] Pre-existing ships
 * @param {number[]} [colCounts] Number of ships in each column (left to right)
 * @param {number[]} [rowCounts] Number of ships in each row (top to bottom)
 * @param {number[]} [runs] Number of each type of ship left (eg. 3 solos and 1 double = [3, 1])
 */
export default class BoardUI extends Component<Props, State> {
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

        this.state = {
            board: board,
            solved: false,
            draggedType: undefined,
            draggedButton: 0,
        };
    }

    solveBoard (): void {
        const newBoard = Board.solve(this.state.board);
        this.setState({
            board: newBoard,
            solved: newBoard.isSolved(),
        });
    }

    reset (): void {
        const board = this.state.board.reset();

        this.setState({
            board: board,
            solved: board.isSolved(),
        });
    }

    onMouseDown (event: React.MouseEvent, index: number): void {
        const ship = this.state.board.getShip(index);

        if (ship.pinned) return;
        if (event.button !== 0 && event.button !== 2) return;

        // this makes it +1 for left click and +2 for right click (which basically works as -1, but without making it negative)
        const newType = (ship.playType + 1 + event.button / 2) % 3 as PlayType;
        const board = this.state.board.setShip(index, newType).compTypes();

        this.setState({
            board: board,
            solved: board.isSolved(),
            draggedType: newType,
            draggedButton: event.buttons === 1 || event.buttons === 2 ? event.buttons : 0,
        });
    }

    onMouseEnter (index: number): void {
        if (this.state.draggedType === undefined || this.state.board.getShip(index).pinned) return;

        const board = this.state.board.setShip(index, this.state.draggedType).compTypes();
        this.setState({ board: board, solved: board.isSolved() });
    }

    onEnterBoard (event: React.MouseEvent): void {
        if (!this.state.draggedButton || this.state.draggedButton !== event.buttons) {
            this.setState({
                draggedType: undefined,
                draggedButton: 0,
            });
            event.stopPropagation();
        }
    }

    onMouseUp (): void {
        this.setState({ draggedType: undefined });
    }

    typeToImg (type: GraphicalType, key: number, size?: number): ReactElement | undefined {
        switch (type) {
            case TYPE.UNKNOWN:
                return;
            case TYPE.SINGLE:
                return <Image className='Ship' key={key} fill={!size} width={size} height={size} src='./ships/single.svg' alt='Single' />;
            case TYPE.UP:
                return <Image className='Ship' key={key} fill={!size} width={size} height={size} src='./ships/end.svg' alt='Up' style={{ transform: 'rotate(90deg)' }} />;
            case TYPE.RIGHT:
                return <Image className='Ship' key={key} fill={!size} width={size} height={size} src='./ships/end.svg' alt='Right' style={{ transform: 'rotate(180deg)' }} />;
            case TYPE.LEFT:
                return <Image className='Ship' key={key} fill={!size} width={size} height={size} src='./ships/end.svg' alt='Left' />;
            case TYPE.DOWN:
                return <Image className='Ship' key={key} fill={!size} width={size} height={size} src='./ships/end.svg' alt='Down' style={{ transform: 'rotate(-90deg)' }} />;
            case TYPE.SHIP:
                return <Image className='Ship' key={key} fill={!size} width={size} height={size} src='./ships/ship.svg' alt='Ship' />;
            case TYPE.ORTHOGONAL:
                return <Image className='Ship' key={key} fill={!size} width={size} height={size} src='./ships/vertical-horizontal.svg' alt='Vertical/Horizontal' />;
            case TYPE.WATER:
                return <Image className='Ship' key={key} fill={!size} width={size} height={size} src='./ships/water.svg' alt='Water' />;
        }
    }

    renderBoard (): ReactElement[] {
        return this.state.board.state.map((ship, index) => {
            return (
                <div
                    className='Square nohighlight'
                    key={index}
                    onMouseDown={event => this.onMouseDown(event, index)}
                    onMouseEnter={() => this.onMouseEnter(index)}
                    onMouseUp={() => this.onMouseUp()}
                    onContextMenu={e => e.preventDefault()}
                >
                    {this.typeToImg(this.state.solved && ship.playType === TYPE.WATER ? TYPE.UNKNOWN : ship.graphicalType, index)}
                </div>
            );
        });
    }

    /**
     * displays counts for columns and rows
     * @param rows true if it should return row counts instead of column counts
     */
    displayCounts (rows: boolean): ReactElement[] {
        return (rows ? this.state.board.rowCounts : this.state.board.colCounts).map((count, index) => (
            <p
                key={index}
                onClick={() => {
                    const board = rows ? this.state.board.softFloodRow(index) : this.state.board.softFloodCol(index);
                    board.compTypes();
                    this.setState({ board: board, solved: board.isSolved() });
                }}
            >
                {count}
            </p>
        ));
    }

    /**
     * displays a visual representation of the number of runs left
     */
    displayRuns (): ReactElement[] {
        // create all runs from this.state.board.runs
        // all ships should be grayed out by default
        // runsDiff[i] of them should be not grayed out
        // if runsDiff[i] is negative, they should all be red
        const out = [];
        const counts = this.state.board.countRunsLeft(true);

        let key = 0;
        for (let i = 0; i < this.state.board.runs.length; i++) {
            for (let j = 0; j < this.state.board.runs[i]; j++) {
                const classes = 'Run' + (counts[i] < 0 ? ' over' : '') + ((j < counts[i]) ? '' : ' desaturated');
                out.push(
                    <span className={classes} key={key}>
                        {this.renderRun(i + 1)}
                    </span>,
                );
                key++;
            }
        }

        return out;
    }

    /**
     * Converts a length into a jsx
     */
    renderRun (length: number): (ReactElement | undefined)[] {
        const SIZE = 25;// px

        if (length === 1) return [this.typeToImg(TYPE.SINGLE, 0, SIZE)];

        const out = [this.typeToImg(TYPE.RIGHT, 0, SIZE)];

        for (let i = 0; i < length - 2; i++) {
            out.push(this.typeToImg(TYPE.ORTHOGONAL, i + 1, SIZE));
        }

        return [...out, this.typeToImg(TYPE.LEFT, out.length, SIZE)];
    }

    render (): ReactNode {
        return (
            <>
                <div className='Board'>
                    <div className='Runs'>
                        {this.displayRuns()}
                    </div>
                    <div className='Inner'>
                        <span />
                        <div
                            className='Column Counts'
                            style={{ gridTemplate: `auto / repeat(${this.state.board.height}, 50px)` }}
                        >
                            {this.displayCounts(false) /* false = columns */}
                        </div>
                        <div
                            className='Row Counts'
                            style={{ gridTemplate: `repeat(${this.state.board.width}, 50px) / auto` }}
                        >
                            {this.displayCounts(true) /* true = rows */}
                        </div>
                        <div
                            className={'Ships' + (this.state.solved ? ' Solved' : '')}
                            style={{ gridTemplate: `repeat(${this.state.board.width}, 50px) / repeat(${this.state.board.height}, 50px)` }}
                            onMouseEnter={e => this.onEnterBoard(e)}
                        >
                            {this.renderBoard()}
                        </div>
                    </div>
                </div>
                <button onClick={() => { this.solveBoard(); }}>
                    Solve
                </button>
                <button onClick={() => { this.reset(); }}>
                    Reset
                </button>
            </>
        );
    }
}
