import { Show } from 'solid-js';
import type { JSX } from 'solid-js';
import { useCalendarStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import { CalendarEvent } from 'src/types';
import {
    SCREEN_WIDTH,
    EVENT_COLORS,
    EVENT_MIN_BOX_SIZE,
} from 'src/constants';

interface Props extends CalendarEvent {
    index: number,
}

export default function EventItem(props: Props) {
    const brightness = useCalendarStateSelect('brightness');
    const startTime = new Date(props.start.dateTime);
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const startPosition = Math.round(remapValue({
        value: startMinutes,
        inMin: 0,
        inMax: 24 * 60,
        outMin: 0,
        outMax: SCREEN_WIDTH,
    }));
    const endTime = new Date(props.end.dateTime);
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const endPosition = Math.round(remapValue({
        value: endMinutes,
        inMin: 0,
        inMax: 24 * 60,
        outMin: 0,
        outMax: SCREEN_WIDTH,
    }));
    const width = endPosition - startPosition;

    return (
        <div
            class="ec-event-item"
            style={{
                width: `${width}px`,
                left: `${startPosition}px`,
                opacity: brightness() / 100,
                'border-color': EVENT_COLORS[props.index],
                color: EVENT_COLORS[props.index],
            }}
        >
            <Show when={width <= EVENT_MIN_BOX_SIZE}>
                <EventItemTime>
                    {timeUtils.getTimeString(startMinutes)}
                </EventItemTime>
                <EventItemTime>
                    {timeUtils.getTimeString(endMinutes)}
                </EventItemTime>
            </Show>
            <Show when={width > EVENT_MIN_BOX_SIZE}>
                <EventItemTime>
                    {timeUtils.getTimeString(startMinutes)}
                    &nbsp;-&nbsp;
                    {timeUtils.getTimeString(endMinutes)}
                </EventItemTime>
            </Show>
            <div class="ecei-summary">
                {props.summary}
            </div>
        </div>
    );
}

function EventItemTime(props: { children: JSX.Element }) {
    return (
        <div class="eceitr-svg-container">
            <svg width="100%" height="10" viewBox="0 0 300 10" preserveAspectRatio="none">
                <text
                    x="0"
                    y="10"
                    textLength="100%"
                    lengthAdjust="spacingAndGlyphs"
                    font-size="15px"
                    fill="currentColor"
                >
                    {props.children}
                </text>
            </svg>
        </div>
    );
}