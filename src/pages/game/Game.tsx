import { onMount, onCleanup } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    ROUTER_HOME,
} from 'src/constants';

export default function GamePage() {
    const navigate = useNavigate();
    
    const keydownHandler = (event: KeyboardEvent) => {
        if (event.code === 'KeyG') {
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
            Game page
        </div>
    );
}