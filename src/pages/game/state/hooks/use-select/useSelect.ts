import { createMemo, Accessor } from 'solid-js';
import { gameStateActor } from '../../state';
import { GameStateContext } from '../../types';

export function useGameStateSelect<K extends keyof GameStateContext>(key: K): Accessor<GameStateContext[K]> {
    const value = createMemo(() => gameStateActor.context[key]);

    return value;
}