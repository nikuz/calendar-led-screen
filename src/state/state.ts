import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { AppStateContext, AppStateEvents } from './types';

const appState = () => {
    const [context, setContext] = createStore<AppStateContext>({
        brightness: 0,
    });

    const send = (event: AppStateEvents) => {
        switch (event.type) {
            case 'SET_BRIGHTNESS':
                setContext('brightness', event.value);
                break;
        }
    };

    return {
        context,
        send,
    };
};

export const appStateActor = createRoot(() => appState());