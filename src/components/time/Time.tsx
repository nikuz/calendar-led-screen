import { createEffect, createMemo, onCleanup, Show, on} from 'solid-js';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    TIME_COLOR,
    TIME_POINTER_WIDTH,
    TIME_FONT_SIZE,
    TIME_FONT_SIZE_NIGHT_TIME,
} from 'src/constants';
import './Time.css';

export function Time() {
    const time = useCalendarStateSelect('time');
    const brightness = useCalendarStateSelect('brightness');
    const timePointerPosition = createMemo(() => Math.round(remapValue({
        value: time().getHours() * 60 + time().getMinutes(),
        inMin: 0,
        inMax: 24 * 60,
        outMin: 0,
        outMax: SCREEN_WIDTH - TIME_POINTER_WIDTH,
    })));
    let timeValueRef: HTMLDivElement | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const isNightTime = createMemo(() => timeUtils.isNightTime(time()));

    const hours = createMemo(() => {
        let hours = time().getHours();
        
        if (hours > 12) {
            hours -= 12;
        }

        return hours;
    });
    
    const updateTime = () => {
        calendarStateActor.send({
            type: 'SET_TIME',
            time: new Date(),
        });
    };

    createEffect(on([time], () => {
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
                id="tc-clock"
                ref={timeValueRef}
                style={{
                    color: TIME_COLOR,
                    'font-size': `${isNightTime() ? TIME_FONT_SIZE_NIGHT_TIME : TIME_FONT_SIZE}px`,
                }}
            >
                {hours()}
                
                <span id="tcc-divider">
                    :
                    <Show when={!isNightTime()}>
                        <div
                            id="tc-time-pointer"
                            class="tctp-top"
                            style={{
                                background: TIME_COLOR,
                                width: `${TIME_POINTER_WIDTH}px`,
                                height: `${SCREEN_HEIGHT}px`,
                            }}
                        />
                        <div
                            id="tc-time-pointer"
                            class="tctp-bottom"
                            style={{
                                background: TIME_COLOR,
                                width: `${TIME_POINTER_WIDTH}px`,
                                height: `${SCREEN_HEIGHT}px`,
                            }}
                        />
                    </Show>
                </span>

                {timeUtils.padTimeNumber(time().getMinutes())}
            </div>
        </div>
    );
}
