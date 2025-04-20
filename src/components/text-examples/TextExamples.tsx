import { createSignal, onMount, onCleanup } from 'solid-js';
import './TextExamples.css';

export function TextExamples() {
    const [terminusFontSize, setTerminusFontSize] = createSignal(5);

    const keydownHandler = (event: KeyboardEvent) => {
        const step = event.shiftKey ? 0.1 : 0.01;
        let newFontSize = terminusFontSize();

        if (event.code === 'ArrowUp') {
            newFontSize += step;
        } else if (event.code === 'ArrowDown') {
            newFontSize -= step;
        }

        setTerminusFontSize(Math.max(newFontSize, 1));
    };

    onMount(() => {
        document.addEventListener('keydown', keydownHandler);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keydownHandler);
    });

    return (
        <div id="text-examples-container">
            <div>
                <div class="tsct-unscii-8">20:56</div>
                <div class="tsct-unscii-16">20:56</div>
                <div class="tsct-unscii-16-large">20:56</div>
            </div>

            <div>
                <div
                    class="tsct-terminus"
                    style={{
                        'font-size': `${terminusFontSize()}pt`,
                    }}
                >
                    20:56
                </div>
                Size: {terminusFontSize()}pt
            </div>
        </div>
    );
}
