import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { retrieveStoredTypingSamples, storeTypingSamples } from '@game/utils';
import { GAME_TYPING_SAMPLE_MAX_AMOUNT } from '@game/constants';
import { GameStateContext, GameStateEvents } from './types';

const gameState = (input: string[]) => {
    const [context, setContext] = createStore<GameStateContext>({
        typingSamples: input,

        focusedSampleIndex: 0,

        sampleCreatorIsOpen: false,

        hitCharacters: new Map(),
        missCharacters: new Map(),

        gameStartTime: 0,
        gameStopTime: 0,
        gameOver: false,
    });

    const send = (event: GameStateEvents) => {
        switch (event.type) {
            case 'OPEN_SAMPLE_CREATOR':
                setContext('sampleCreatorIsOpen', true);
                break;
            
            case 'CLOSE_SAMPLE_CREATOR':
                setContext({
                    sampleCreatorIsOpen: false,
                    focusedSampleIndex: 0,
                });
                break;
            
            case 'FOCUS_PREV_SAMPLE': {
                let prevIndex = context.focusedSampleIndex - 1;
                
                if (prevIndex < 0) {
                    prevIndex = context.typingSamples.length;
                }

                setContext('focusedSampleIndex', prevIndex);
                break;
            }
                
            case 'FOCUS_NEXT_SAMPLE': {
                let nextIndex = context.focusedSampleIndex + 1;

                if (nextIndex > context.typingSamples.length) {
                    nextIndex = 0;
                }

                setContext('focusedSampleIndex', nextIndex);
                break;
            }
                
            case 'SELECT_SAMPLE':
                setContext({
                    selectedSampleIndex: event.sampleIndex,
                    gameStartTime: Date.now(),
                });
                break;
            
            case 'ADD_SAMPLE': {
                const samples = [event.sample, ...context.typingSamples].slice(0, GAME_TYPING_SAMPLE_MAX_AMOUNT);
                setContext({
                    typingSamples: samples,
                    selectedSampleIndex: 0,
                    sampleCreatorIsOpen: false,
                });
                storeTypingSamples(samples);
                break;
            }
            
            case 'HIT_CHARACTER': {
                const hitCharacters = new Map(context.hitCharacters);
                hitCharacters.set(event.index, true);
                setContext('hitCharacters', hitCharacters);
                break;
            }
                
            case 'MISS_CHARACTER': {
                const missCharacters = new Map(context.missCharacters);
                missCharacters.set(event.index, true);
                setContext('missCharacters', missCharacters);
                break;
            }
                
            case 'GAME_OVER':
                setContext({
                    gameOver: true,
                    gameStopTime: Date.now(),
                });
                break;
            
            case 'RESTART':
                setContext({
                    gameOver: false,
                    selectedSampleIndex: undefined,
                    hitCharacters: new Map(),
                    missCharacters: new Map(),
                    gameStartTime: 0,
                    gameStopTime: 0,
                });
                break;
        }
    };

    return {
        context,
        send,
    };
};

export const gameStateActor = createRoot(() => gameState(retrieveStoredTypingSamples()));