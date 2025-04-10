import { createEffect, createMemo, onCleanup, Show, on} from 'solid-js';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    TIME_COLOR,
    TIME_NIGHT_COLOR,
    TIME_POINTER_WIDTH,
    TIME_FONT_SIZE,
    TIME_FONT_SIZE_NIGHT_TIME,
    EVENT_COLORS,
} from 'src/constants';
import './Time.css';

export function Time() {
    const time = useCalendarStateSelect('time');
    const timeIsHovered = useCalendarStateSelect('timeIsHovered');
    const brightness = useCalendarStateSelect('brightness');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');
    const timePointerPosition = createMemo(() => Math.round(remapValue({
        value: time().getHours() * 60 + time().getMinutes(),
        inMin: 0,
        inMax: 24 * 60,
        outMin: 0,
        outMax: SCREEN_WIDTH - TIME_POINTER_WIDTH,
    })));
    let timeValueElRef: HTMLDivElement | undefined;
    let hoursElRef: HTMLDivElement | undefined;
    let minutesElRef: HTMLDivElement | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const isNightTime = createMemo(() => timeUtils.isNightTime(time()));

    const hours = createMemo(() => {
        let hours = time().getHours();
        
        if (hours > 12) {
            hours -= 12;
        }

        return hours;
    });

    const color = createMemo(() => {
        if (isNightTime()) {
            return TIME_NIGHT_COLOR;
        }

        const eventIndex = activeEventIndex();
        if (eventIndex !== undefined) {
            return EVENT_COLORS[eventIndex];
        }

        return TIME_COLOR;
    });

    const updateTime = () => {
        calendarStateActor.send({
            type: 'SET_TIME',
            time: new Date(),
        });
    };

    createEffect(on([time, timeIsHovered], () => {
        clearTimeout(timer);
        if (timeIsHovered()) {
            return;
        }
        const now = new Date();
        timer = setTimeout(updateTime, (60 - now.getSeconds()) * 1000);
    }));

    createEffect(() => {
        if (timeValueElRef && hoursElRef && minutesElRef) {
            const timeValueHalfSize = timeValueElRef.getBoundingClientRect().width / 2;
            const hoursSize = hoursElRef.getBoundingClientRect().width;
            const minutesSize = minutesElRef.getBoundingClientRect().width;
            let left = timePointerPosition();

            if (left - timeValueHalfSize - hoursSize < 0) {
                left = timeValueHalfSize + hoursSize;
            } else if (left + timeValueHalfSize + minutesSize > SCREEN_WIDTH) {
                left = SCREEN_WIDTH - timeValueHalfSize - minutesSize;
            }

            timeValueElRef.style.left = `${left}px`;
        }
    });

    onCleanup(() => {
        clearTimeout(timer);
    });

    return (
        <div id="time-container" style={{ opacity: brightness() / 100 }}>
            <div
                id="tc-clock"
                ref={timeValueElRef}
                style={{
                    color: color(),
                    'font-size': `${isNightTime() ? TIME_FONT_SIZE_NIGHT_TIME : TIME_FONT_SIZE}px`,
                    transition: timeIsHovered() ? 'none' : 'left 100ms linear',
                }}
            >
                <span id="tcc-hours" ref={hoursElRef}>
                    {hours()}
                </span>
                
                <span id="tcc-divider">
                    :
                    <Show when={!isNightTime()}>
                        <div
                            id="tc-time-pointer"
                            class="tctp-top"
                            style={{
                                background: color(),
                                width: `${TIME_POINTER_WIDTH}px`,
                                height: `${SCREEN_HEIGHT}px`,
                            }}
                        />
                        <div
                            id="tc-time-pointer"
                            class="tctp-bottom"
                            style={{
                                background: color(),
                                width: `${TIME_POINTER_WIDTH}px`,
                                height: `${SCREEN_HEIGHT}px`,
                            }}
                        />
                    </Show>
                </span>

                <span id="tcc-minutes" ref={minutesElRef}>
                    {timeUtils.padTimeNumber(time().getMinutes())}
                </span>
            </div>
        </div>
    );
}
