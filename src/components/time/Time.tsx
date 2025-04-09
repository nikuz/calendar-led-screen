import { createEffect, createMemo, onCleanup, Show, on} from 'solid-js';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import {
    SCREEN_WIDTH,
    TIME_COLOR,
    TIME_POINTER_WIDTH,
    TIME_POINTER_HEIGHT,
    TIME_FONT_SIZE,
    TIME_FONT_SIZE_NIGHT_TIME,
} from 'src/constants';
import './Time.css';

export function Time() {
    const hour = useCalendarStateSelect('hour');
    const minute = useCalendarStateSelect('minute');
    const brightness = useCalendarStateSelect('brightness');
    const timePointerPosition = createMemo(() => Math.round(remapValue({
        value: hour() * 60 + minute(),
        inMin: 0,
        inMax: 24 * 60,
        outMin: 0,
        outMax: SCREEN_WIDTH - TIME_POINTER_WIDTH,
    })));
    const isNightTime = createMemo(() => timeUtils.isNightTime(hour()));
    let timeValueRef: HTMLDivElement | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const padTimeNumber = (value: number) => String(value).padStart(2, '0');

    const updateTime = () => {
        const now = new Date();

        calendarStateActor.send({
            type: 'SET_TIME',
            hour: now.getHours(),
            minute: now.getMinutes(),
        });
    };

    createEffect(on([hour, minute], () => {
        const now = new Date();
        timer = setTimeout(updateTime, (60 - now.getSeconds()) * 1000);
    }));

    createEffect(() => {
        if (timeValueRef) {
            const elementHalfSize = timeValueRef.getBoundingClientRect().width / 2;
            let left = timePointerPosition();

            if (left - elementHalfSize < 0) {
                left = elementHalfSize;
            } else if (left + elementHalfSize > SCREEN_WIDTH) {
                left = SCREEN_WIDTH - elementHalfSize;
            }

            timeValueRef.style.left = `${left + 1}px`;
        }
    });

    onCleanup(() => {
        clearInterval(timer);
    });

    return (
        <div id="time-container" style={{ opacity: brightness() / 100 }}>
            <div
                id="time-value"
                ref={timeValueRef}
                style={{
                    color: TIME_COLOR,
                    'font-size': `${isNightTime() ? TIME_FONT_SIZE_NIGHT_TIME : TIME_FONT_SIZE}px`,
                }}
            >
                {padTimeNumber(hour())}
                :
                {padTimeNumber(minute())}
            </div>
            
            <Show when={!isNightTime()}>
                <div
                    id="tc-time-pointer"
                    style={{
                        width: `${TIME_POINTER_WIDTH}px`,
                        height: `${TIME_POINTER_HEIGHT}px`,
                        left: `${timePointerPosition()}px`,
                    }}
                />
            </Show>
        </div>
    );
}
