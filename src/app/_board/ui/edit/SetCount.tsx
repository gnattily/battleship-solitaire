import type { KeyboardEvent } from 'react';
import { useRef, type JSX } from 'react';

type Params = {
    updateCount: (count: number) => void;
    del: () => void;
    initCount: number;
    max: number;
};

export default function SetCount ({ initCount, updateCount, del, max }: Params): JSX.Element {
    const input = useRef<HTMLInputElement>(null);

    function submit (): void {
        if (!input.current) throw ReferenceError;
        const val = parseInt(input.current.value);

        if (Number.isInteger(val) && val >= 0 && val <= max)
            updateCount(val);

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
            min={0}
            max={max}
            defaultValue={initCount}
            onKeyDown={handleKey}
            onBlur={submit}
            onFocus={e => e.target.select()}
        />
    );
}
