import { createEffect, createMemo, onCleanup, on } from 'solid-js';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { remapValue } from 'src/utils';
import {
    SCREEN_WIDTH,
    TIME_COLOR,
    TIME_POINTER_WIDTH,
    TIME_POINTER_HEIGHT,
} from 'src/constants';
import './Time.css';

export function Time() {
    const hour = useCalendarStateSelect('hour');
    const minute = useCalendarStateSelect('minute');
    const timePointerPosition = createMemo(() => Math.round(remapValue({
        value: hour() * 60 + minute(),
        inMin: 0,
        inMax: 60 * 24,
        outMin: 0,
        outMax: SCREEN_WIDTH - TIME_POINTER_WIDTH,
    })));
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
        <div id="time-container">
            <div
                id="time-value"
                ref={timeValueRef}
                style={{ color: TIME_COLOR }}
            >
                {padTimeNumber(hour())}
                :
                {padTimeNumber(minute())}
            </div>
            
            <div
                id="tc-time-pointer"
                style={{
                    width: `${TIME_POINTER_WIDTH}px`,
                    height: `${TIME_POINTER_HEIGHT}px`,
                    left: `${timePointerPosition()}px`,
                }}
            />
        </div>
    );
}
