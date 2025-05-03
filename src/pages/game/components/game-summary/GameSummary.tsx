import { createMemo, onMount } from 'solid-js';
import { gameStateActor, useGameStateSelect } from '@game/state';
import { GAME_CHARACTERS_PER_WORD } from '@game/constants';
import './GameSummary.css';

export function GameSummary() {
    const hitCharacters = useGameStateSelect('hitCharacters');
    const missCharacters = useGameStateSelect('missCharacters');
    const gameStartTime = useGameStateSelect('gameStartTime');
    const gameStopTime = useGameStateSelect('gameStopTime');
    let restartBtnEl: HTMLButtonElement | undefined;

    const gameDurationMin = createMemo(() => (gameStopTime() - gameStartTime()) / 1000 / 60);

    const wpm = createMemo(() => {
        const value = Math.floor(hitCharacters().size / gameDurationMin() / GAME_CHARACTERS_PER_WORD);
        return Number.isNaN(value) ? 0 : value;
    });

    const restartHandler = () => {
        gameStateActor.send({ type: 'RESTART' });
    };

    onMount(() => {
        restartBtnEl?.focus();
    });
    
    return (
        <div class="game-summary-container">
            <dl class="gsc-stats">
                <dt>Hit:</dt>
                <dd>{hitCharacters().size}</dd>

                <dt>Miss:</dt>
                <dd>{missCharacters().size}</dd>

                <dt>WPM:</dt>
                <dd>{wpm()}</dd>
            </dl>

            <button
                ref={restartBtnEl}
                class="game-btn"
                onClick={restartHandler}
            >
                Restart
            </button>
        </div>
    );
}