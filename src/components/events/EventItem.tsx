import { Show } from 'solid-js';
import { useCalendarStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import { CalendarEvent } from 'src/types';
import {
    SCREEN_WIDTH,
    DAY_START_TIME,
    DAY_END_TIME,
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
        inMin: DAY_START_TIME,
        inMax: DAY_END_TIME,
        outMin: 0,
        outMax: SCREEN_WIDTH,
    }));
    const endTime = new Date(props.end.dateTime);
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const endPosition = Math.round(remapValue({
        value: endMinutes,
        inMin: DAY_START_TIME,
        inMax: DAY_END_TIME,
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
            <div class="ecei-time">
                <Show when={width <= EVENT_MIN_BOX_SIZE}>
                    <div class="ecei-time-item tiny">
                        {timeUtils.getTimeString(startMinutes)}
                    </div>
                    <div class="ecei-time-item tiny">
                        {timeUtils.getTimeString(endMinutes)}
                    </div>
                </Show>
                <Show when={width > EVENT_MIN_BOX_SIZE}>
                    <div class="ecei-time-item">
                        {timeUtils.getTimeString(startMinutes)}
                        &nbsp;-&nbsp;
                        {timeUtils.getTimeString(endMinutes)}
                    </div>
                </Show>
            </div>
            <div class="ecei-summary">
                <div>{props.summary}</div>
            </div>
        </div>
    );
}