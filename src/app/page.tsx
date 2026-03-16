import Board from './_board/logic/Board';
import { URLSafeToB64 } from './_board/logic/BoardUtils';
import BoardUI from './_board/ui/BoardUI';
import './page.css';

import type { JSX } from 'react';

export default async function Page ({ searchParams }: { searchParams: { [key: string]: string | undefined } }): Promise<JSX.Element> {
    let { board } = searchParams;
    let startBoard: Board | undefined;

    // Realistically this should be in a Board helper file -TODO
    if (typeof board === 'string') {
        board = URLSafeToB64(board);

        try {
            startBoard = Board.from(board);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className='BoardUI'>
            {((): JSX.Element => {
                if (startBoard) {
                    return (
                        <BoardUI
                            board={startBoard.export()}
                        />
                    );
                } else return <BoardUI width={4} height={4} />;
            })()}
        </div>
    );
}
