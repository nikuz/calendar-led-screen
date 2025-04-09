import { useCalendarStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import { CalendarEvent } from 'src/types';
import {
    SCREEN_WIDTH,
    EVENT_COLORS,
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

    return (
        <div
            class="ec-event-item"
            style={{
                width: `${endPosition - startPosition}px`,
                left: `${startPosition}px`,
                opacity: brightness() / 100,
                'border-color': EVENT_COLORS[props.index],
            }}
        >
            <div class="ecei-time-range">
                {timeUtils.formatTimeRange(startMinutes, endMinutes)}
            </div>
            <div class="ecei-summary">
                {props.summary}
            </div>
        </div>
    );
}
