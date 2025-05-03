import { onMount, onCleanup, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useGameStateSelect } from './state';
import {
    SampleCreator,
    TypingSamples,
    Game,
} from './components';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    ROUTER_HOME,
} from 'src/constants';
import './GamePage.css';

export default function GamePage() {
    const sampleCreatorIsOpen = useGameStateSelect('sampleCreatorIsOpen');
    const selectedSampleIndex = useGameStateSelect('selectedSampleIndex');
    const navigate = useNavigate();

    const keydownHandler = (event: KeyboardEvent) => {
        const activeElement = document.activeElement;
        if (event.code === 'KeyG' && (!activeElement || activeElement.nodeName !== 'TEXTAREA')) {
            navigate(ROUTER_HOME);
        }
    };

    onMount(() => {
        document.addEventListener('keydown', keydownHandler);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keydownHandler);
    });
    
    return (
        <div
            style={{
                width: `${SCREEN_WIDTH}px`,
                height: `${SCREEN_HEIGHT}px`,
            }}
        >
            <Show when={selectedSampleIndex() === undefined && sampleCreatorIsOpen()}>
                <SampleCreator /> 
            </Show>
            <Show when={selectedSampleIndex() === undefined && !sampleCreatorIsOpen()}>
                <TypingSamples />
            </Show>
            <Show when={selectedSampleIndex() !== undefined}>
                <Game />
            </Show>
        </div>
    );
}