import { onMount, onCleanup, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAppStateSelect } from 'src/state';
import { useGameStateSelect } from './state';
import {
    SampleCreator,
    TypingSamples,
    Game,
    GameSummary,
} from './components';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    ROUTER_HOME,
} from 'src/constants';
import './GamePage.css';

export default function GamePage() {
    const brightness = useAppStateSelect('brightness');
    const sampleCreatorIsOpen = useGameStateSelect('sampleCreatorIsOpen');
    const selectedSampleIndex = useGameStateSelect('selectedSampleIndex');
    const gameOver = useGameStateSelect('gameOver');
    const navigate = useNavigate();

    const keydownHandler = (event: KeyboardEvent) => {
        if (event.code === 'KeyG' && selectedSampleIndex() === undefined && !sampleCreatorIsOpen() && !gameOver()) {
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
                opacity: brightness() / 100,
            }}
        >
            <Show when={selectedSampleIndex() === undefined && sampleCreatorIsOpen() && !gameOver()}>
                <SampleCreator /> 
            </Show>
            <Show when={selectedSampleIndex() === undefined && !sampleCreatorIsOpen() && !gameOver()}>
                <TypingSamples />
            </Show>
            <Show when={selectedSampleIndex() !== undefined && !gameOver()}>
                <Game />
            </Show>
            <Show when={gameOver()}>
                <GameSummary />
            </Show>
        </div>
    );
}