import { createSignal, createMemo, createEffect, onMount, onCleanup, For } from 'solid-js';
import { gameStateActor, useGameStateSelect } from '@game/state';
import { revealInvisibleCharacters } from '@game/utils';
import { GAME_FONT_SIZE, GAME_CHARACTERS_PER_WORD } from '@game/constants';
import GameCharacter from './GameCharacter';
import './Game.css';

export function Game() {
    const typingSamples = useGameStateSelect('typingSamples');
    const selectedSampleIndex = useGameStateSelect('selectedSampleIndex');
    const hitCharacters = useGameStateSelect('hitCharacters');
    const gameStartTime = useGameStateSelect('gameStartTime');
    const [nextSymbolIndex, setNextSymbolIndex] = createSignal(0);
    const [gameDurationMin, setGameDurationMin] = createSignal(0);
    let gameTimer: ReturnType<typeof setInterval> | undefined;

    const selectedSampleCharacters = createMemo(() => {
        const index = selectedSampleIndex();
        if (index !== undefined) {
            return revealInvisibleCharacters(typingSamples()[index]).split('');
        }

        return [];
    });

    const wpm = createMemo(() => {
        const value = Math.floor(hitCharacters().size / gameDurationMin() / GAME_CHARACTERS_PER_WORD);
        return Number.isNaN(value) ? 0 : value;
    });

    const keydownHandler = (event: KeyboardEvent) => {
        const nextIndex = nextSymbolIndex();

        switch (event.code) {
            case 'Escape':
                gameStateActor.send({ type: 'RESTART' });
                return;
            
            case 'ArrowLeft':
                setNextSymbolIndex(Math.max(nextIndex - 1, 0));
                return;
            
            case 'ArrowRight':
                setNextSymbolIndex(Math.min(nextIndex + 1, selectedSampleCharacters().length));
                return;
        }

        if (event.key === 'Shift' || event.key === 'Ctrl' || event.key === 'Meta' || event.key === 'Alt') {
            return;
        }

        const characters = selectedSampleCharacters();
        if (
            characters.length
            && (
                event.key === characters[nextIndex]
                || event.code === 'Enter' && characters[nextIndex] === '↵'
                || event.code === 'Tab' && characters[nextIndex] === '→'
            )
        ) {
            setNextSymbolIndex(nextIndex + 1);
            gameStateActor.send({
                type: 'HIT_CHARACTER',
                index: nextIndex,
            });
        } else {
            // setNextSymbolIndex(nextIndex + 1);
            // gameStateActor.send({
            //     type: 'MISS_CHARACTER',
            //     index: nextIndex,
            // });
        }
    };

    createEffect(() => {
        if (nextSymbolIndex() === selectedSampleCharacters().length) {
            gameStateActor.send({ type: 'GAME_OVER' });
        }
    });

    onMount(() => {
        document.addEventListener('keydown', keydownHandler);
        gameTimer = setInterval(() => {
            setGameDurationMin((Date.now() - gameStartTime()) / 1000 / 60);
        }, 1000);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keydownHandler);
        clearInterval(gameTimer);
    });

    return (
        <div class="game-container">
            <div class="gc-fade" />
            <div class="gc-separator" />
            <div
                class="gc-text"
                style={{
                    'font-size': `${GAME_FONT_SIZE}px`,
                    'margin-left': `-${nextSymbolIndex() * (GAME_FONT_SIZE / 2)}px`
                }}
            >
                <For each={selectedSampleCharacters()}>
                    {(character, index) => (
                        <GameCharacter
                            character={character}
                            index={index()}
                        />
                    )}
                </For>
            </div>
            <div class="gc-counter">
                {wpm()} WPM
            </div>
        </div>
    );
}