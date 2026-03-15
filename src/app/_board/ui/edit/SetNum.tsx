import type { KeyboardEvent } from 'react';
import { useRef, type JSX } from 'react';

type Params = {
    updateNum: (count: number) => void;
    del: () => void;
    initNum: number;
    max: number;
    min: number;
};

export default function SetNum ({ initNum, updateNum, del, max, min }: Params): JSX.Element {
    const input = useRef<HTMLInputElement>(null);

    function submit (): void {
        if (!input.current) throw ReferenceError;
        const val = parseInt(input.current.value);

        if (Number.isInteger(val) && val >= 0 && val <= max) updateNum(val);

        del();
    }

    function handleKey (e: KeyboardEvent): void {
        if (e.key === 'Enter') return submit();
        if (e.key === 'Escape') return del();
    }

    return (
        <input
            autoFocus
            ref={input}
            type='number'
            min={min}
            max={max}
            defaultValue={initNum}
            onKeyDown={handleKey}
            onBlur={submit}
            onFocus={e => e.target.select()}
        />
    );
}
