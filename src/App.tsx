import { onMount, onCleanup } from 'solid-js';
import type { JSX } from 'solid-js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'src/constants';
import {
    brightnessInitiateConnection,
    brightnessCloseConnection,
} from 'src/services';
import './App.css';

interface Props {
    children?: JSX.Element,
}

export default function App(props: Props) {
    onMount(() => {
        brightnessInitiateConnection();
    });
    
    onCleanup(() => {
        brightnessCloseConnection();
    });

    return (
        <div
            id="app-container"
            style={{
                width: `${SCREEN_WIDTH}px`,
                height: `${SCREEN_HEIGHT}px`,
            }}
        >
            {props.children}
        </div>
    );
}
