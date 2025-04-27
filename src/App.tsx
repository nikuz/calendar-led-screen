import { createSignal, createMemo, onMount, onCleanup, Show } from 'solid-js';
import cl from 'classnames';
import { Time, Events, TextExamples } from 'src/components';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    CALENDAR_BACKGROUND_IMAGE,
} from 'src/constants';
import './App.css';

export default function App() {
    const time = useCalendarStateSelect('time');
    const [testModeIsOn, setTestModeIsOn] = createSignal(false);
    const [imageBackgroundIsOn, setImageBackgroundIsOn] = createSignal(false);
    const isNightTime = createMemo(() => timeUtils.isNightTime(time()));

    const mouseMoveHandler = (event: MouseEvent) => {
        const now = new Date();
        const minutes = Math.round(remapValue({
            value: event.clientX,
            inMin: 0,
            inMax: SCREEN_WIDTH - 1,
            outMin: 0,
            outMax: 24 * 60 - 1,
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
            setTestModeIsOn(!testModeIsOn());
        }
        if (event.code === 'KeyB') {
            setImageBackgroundIsOn(!imageBackgroundIsOn());
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
            id="app-container"
            class={cl({ 'full-screen': testModeIsOn() })}
            style={{
                width: `${SCREEN_WIDTH}px`,
                height: `${SCREEN_HEIGHT}px`,
                'background-image': imageBackgroundIsOn() && !isNightTime() ? `url(${CALENDAR_BACKGROUND_IMAGE})` : 'none',
            }}
            onMouseMove={mouseMoveHandler}
            onMouseLeave={mouseLeaveHandler}
        >
            <Show when={!testModeIsOn()} fallback={<TextExamples />}>
                <Time />
                <Events />
            </Show>
        </div>
    );
}
