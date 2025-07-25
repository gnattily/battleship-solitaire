import './page.css';
import BoardUI from './_board/ui/BoardUI';
import Board from './_board/Board';
import type { JSX } from 'react';

export default async function Page ({ searchParams }: { searchParams: { [key: string]: string | undefined } }): Promise<JSX.Element> {
    let { data } = await searchParams;
    let board: Board | undefined;

    if (typeof data === 'string') {
        data = data
            .replaceAll('-', '+')
            .replaceAll('_', '/')
            .padEnd(data.length + (4 - (data.length % 4)) % 4, '=');

        try {
            board = Board.from(data);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className='BoardUI'>
            {((): JSX.Element => {
                if (board) {
                    return (
                        <BoardUI
                            board={board.export()}
                        />
                    );
                } else return <BoardUI width={4} height={4} />;
            })()}
        </div>
    );
}
