import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import cl from 'classnames';
import { calendarStateActor } from 'src/state';
import { Time, Events, TestShapes } from 'src/components';
import { remapValue } from 'src/utils';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    DAY_START_TIME,
    DAY_END_TIME,
} from 'src/constants';
import './App.css';

export default function App() {
    const [testShapesVisible, setTestShapesVisible] = createSignal(false);
    const mouseMoveHandler = (event: MouseEvent) => {
        const now = new Date();
        const minutes = Math.round(remapValue({
            value: event.clientX,
            inMin: 0,
            inMax: SCREEN_WIDTH - 1,
            outMin: DAY_START_TIME,
            outMax: DAY_END_TIME - 1,
        }));
        const hours = Math.floor(minutes / 60);

        calendarStateActor.send({
            type: 'SET_HOVER_TIME',
            time: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hours,
                minutes % 60,
            ),
        });
    };

    const mouseLeaveHandler = () => {
        calendarStateActor.send({ type: 'RESTORE_TIME' });
    };

    const keydownHandler = (event: KeyboardEvent) => {
        if (event.code === 'KeyT') {
            setTestShapesVisible(true);
        }
    };

    const keyupHandler = (event: KeyboardEvent) => {
        if (event.code === 'KeyT') {
            setTestShapesVisible(false);
        }
    };

    onMount(() => {
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('keyup', keyupHandler);
    });

    return (
        <div
            id="app-container"
            class={cl({ 'full-screen': testShapesVisible() })}
            style={{
                width: `${SCREEN_WIDTH}px`,
                height: `${SCREEN_HEIGHT}px`,
            }}
            onMouseMove={mouseMoveHandler}
            onMouseLeave={mouseLeaveHandler}
        >
            <Show when={!testShapesVisible()} fallback={<TestShapes />}>
                <Time />
                <Events />
            </Show>
        </div>
    );
}
