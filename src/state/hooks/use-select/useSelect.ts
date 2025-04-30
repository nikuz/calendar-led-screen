import { createMemo, Accessor } from 'solid-js';
import { appStateActor } from '../../state';
import { AppStateContext } from '../../types';

export function useAppStateSelect<K extends keyof AppStateContext>(key: K): Accessor<AppStateContext[K]> {
    const value = createMemo(() => appStateActor.context[key]);

    return value;
}