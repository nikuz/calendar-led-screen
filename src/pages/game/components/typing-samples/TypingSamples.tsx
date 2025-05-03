import { createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import { gameStateActor, useGameStateSelect } from '@game/state';
import TypingSampleItem from './TypingSampleItem';
import './TypingSamples.css';

export function TypingSamples() {
    const focusedSampleIndex = useGameStateSelect('focusedSampleIndex');
    const typingSamples = useGameStateSelect('typingSamples');
    let createBtnElRef: HTMLButtonElement | undefined;

    const openSampleCreatorHandler = () => {
        gameStateActor.send({ type: 'OPEN_SAMPLE_CREATOR' });
    };

    const keydownHandler = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowUp':
                gameStateActor.send({ type: 'FOCUS_PREV_SAMPLE' });
                break;
            
            case 'ArrowDown':
            case 'Tab':
                event.preventDefault();
                gameStateActor.send({ type: 'FOCUS_NEXT_SAMPLE' });
                break;
            
            case 'Enter':
                if (focusedSampleIndex() !== typingSamples().length) {
                    gameStateActor.send({
                        type: 'SELECT_SAMPLE',
                        sampleIndex: focusedSampleIndex(),
                    });
                }
                break;
        }
    };

    createEffect(() => {
        if (focusedSampleIndex() === typingSamples().length) {
            createBtnElRef?.focus();
        } else {
            createBtnElRef?.blur();
        }
    });

    onMount(() => {
        document.addEventListener('keydown', keydownHandler);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keydownHandler);
    });
    
    return (
        <div
            class="typing-samples-container"
        >
            <Show when={typingSamples().length === 0}>
                <div class="tsc-empty">No typing samples stored. Add one:</div>
            </Show>

            <Show when={typingSamples().length > 0}>
                <For
                    each={typingSamples()}
                    fallback={<div id="tsc-loading">Loading samples...</div>}
                >
                    {(item, index) => (
                        <TypingSampleItem
                            sample={item}
                            index={index()}
                            focused={index() === focusedSampleIndex()}
                        />
                    )}
                </For>
            </Show>

            <button
                ref={createBtnElRef}
                class="game-btn"
                onClick={openSampleCreatorHandler}
            >
                Create sample
            </button>
        </div>
    );
}