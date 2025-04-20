import { createSignal, onMount, onCleanup } from 'solid-js';
import './TextExamples.css';

export function TextExamples() {
    const [dynamicFontSize, setTerminusFontSize] = createSignal(8);

    const keydownHandler = (event: KeyboardEvent) => {
        const step = event.shiftKey ? 1 : 0.1;
        let newFontSize = dynamicFontSize();

        if (event.code === 'ArrowUp') {
            newFontSize += step;
        } else if (event.code === 'ArrowDown') {
            newFontSize -= step;
        }

        setTerminusFontSize(Math.max(Number(newFontSize.toFixed(2)), 1));
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
                <div class="tsct-PPMondwest-25">20:56</div>
                <div class="tsct-PPMondwest-50">20:56</div>
                <div class="tsct-PPMondwest-75">20:56</div>
            </div>

            <div>
                <div class="tsct-PPNeueBit-28">20:56</div>
                <div class="tsct-PPNeueBit-56">20:56</div>
                <div class="tsct-PPNeueBit-84">20:56</div>
            </div>

            <div>
                <div
                    class="tsct-Tiny5"
                    style={{
                        'font-size': `${dynamicFontSize()}px`,
                    }}
                >
                    20:56
                </div>
                <div class="tsct-font-size-indicator">Font size: {dynamicFontSize()}px</div>
            </div>
        </div>
    );
}
