import { createEffect, createMemo, onCleanup, on } from 'solid-js';
import { useAppStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    DAY_START_TIME,
    DAY_END_TIME,
} from 'src/constants';
import { calendarStateActor, useCalendarStateSelect } from '@calendar/state';
import { 
    TIME_COLOR,
    TIME_NIGHT_COLOR,
    TIME_POINTER_WIDTH,
    TIME_FONT_SIZE,
    TIME_FONT_SIZE_NIGHT_TIME,
    EVENT_COLORS,
} from '@calendar/constants';
import './Time.css';

interface Props {
    forceNight?: boolean,
    position?: number,
    positionMin?: number,
    positionMax?: number,
}

export function Time(props: Props) {
    const brightness = useAppStateSelect('brightness');
    const time = useCalendarStateSelect('time');
    const timeIsHovered = useCalendarStateSelect('timeIsHovered');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');
    let timeValueElRef: HTMLDivElement | undefined;
    let hoursElRef: HTMLDivElement | undefined;
    let minutesElRef: HTMLDivElement | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const timePointerPosition = createMemo(() => {
        let value = props.position;
        let inMin = props.positionMin;
        let inMax = props.positionMax;

        if (value === undefined || inMin === undefined || inMax === undefined) {
            value = time().getHours() * 60 + time().getMinutes();
            inMin = DAY_START_TIME;
            inMax = DAY_END_TIME;
        }

        return Math.round(remapValue({
            value,
            inMin,
            inMax,
            outMin: 0,
            outMax: SCREEN_WIDTH - TIME_POINTER_WIDTH,
        }));
    });

    const isNight = createMemo(() => props.forceNight || timeUtils.isNightTime(time()));

    const hours = createMemo(() => {
        let hours = time().getHours();
        
        if (hours > 12) {
            hours -= 12;
        }

        return hours;
    });

    const color = createMemo(() => {
        if (isNight()) {
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

    createEffect(on([timePointerPosition, isNight], () => {
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

            timeValueElRef.style.left = `${Math.round(left)}px`;
        }
    }));

    onCleanup(() => {
        clearTimeout(timer);
    });

    return (
        <div
            id="time-container"
            style={{
                opacity: brightness() / 100,
                'z-index': activeEventIndex(),
            }}
        >
            <div
                id="tc-clock"
                ref={timeValueElRef}
                style={{
                    color: color(),
                    'font-size': `${isNight() ? TIME_FONT_SIZE_NIGHT_TIME : TIME_FONT_SIZE}px`,
                    transition: timeIsHovered() ? 'none' : 'left 100ms linear',
                }}
            >
                <span id="tcc-hours" ref={hoursElRef}>
                    {hours()}
                </span>
                
                &nbsp;
                
                <div
                    class="tc-time-pointer"
                    style={{
                        background: color(),
                        width: `${TIME_POINTER_WIDTH}px`,
                        height: `${SCREEN_HEIGHT}px`,
                    }}
                />

                <span id="tcc-minutes" ref={minutesElRef}>
                    {timeUtils.padTimeNumber(time().getMinutes())}
                </span>
            </div>
        </div>
    );
}
