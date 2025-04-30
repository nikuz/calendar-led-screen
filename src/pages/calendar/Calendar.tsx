import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { remapValue } from 'src/utils';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    ROUTER_GAME,
} from 'src/constants';
import {
    Time,
    Events,
    TextExamples,
    Background,
} from '@calendar/components';
import { calendarStateActor } from '@calendar/state';

export default function CalendarPage() {
    const [testModeIsOn, setTestModeIsOn] = createSignal(false);
    const navigate = useNavigate();

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
        if (event.code === 'KeyG') {
            navigate(ROUTER_GAME);
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
            onMouseMove={mouseMoveHandler}
            onMouseLeave={mouseLeaveHandler}
        >
            <Background />
            <Show when={!testModeIsOn()} fallback={<TextExamples />}>
                <Time />
                <Events />
            </Show>
        </div>
    );
}
