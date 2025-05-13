import { createSignal, createMemo, createEffect, onCleanup, on, Show } from 'solid-js';
import cl from 'classnames';
import { useAppStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import { SCREEN_WIDTH, DAY_START_TIME, DAY_END_TIME } from 'src/constants';
import { useCalendarStateSelect } from '@calendar/state';
import {
    EVENT_COLORS,
    EVENT_MIN_BOX_SIZE,
    EVENT_APPROACHING_BLINK_INTERVAL,
    EVENTS_ZOOM,
} from '@calendar/constants';
import { CalendarEvent } from '@calendar/types';

interface Props extends CalendarEvent {
    index: number,
}

export default function EventItem(props: Props) {
    const brightness = useAppStateSelect('brightness');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');
    const approachingEventIndex = useCalendarStateSelect('approachingEventIndex');
    const approachingEventConfirmedIndex = useCalendarStateSelect('approachingEventConfirmedIndex');
    const [blinkCycle, setBlinkCycle] = createSignal<'high' | 'low'>('high');
    const startTime = new Date(props.start.dateTime);
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const startPosition = Math.round(remapValue({
        value: startMinutes,
        inMin: DAY_START_TIME,
        inMax: DAY_END_TIME,
        outMin: 0,
        outMax: SCREEN_WIDTH * EVENTS_ZOOM,
    }));
    const endTime = new Date(props.end.dateTime);
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const endPosition = Math.round(remapValue({
        value: endMinutes,
        inMin: DAY_START_TIME,
        inMax: DAY_END_TIME,
        outMin: 0,
        outMax: SCREEN_WIDTH * EVENTS_ZOOM,
    }));
    const width = endPosition - startPosition;
    let blinkTimer: ReturnType<typeof setTimeout> | undefined;

    const isActive = createMemo(() => activeEventIndex() === props.index);
    const isApproaching = createMemo(() => (
        approachingEventIndex() === props.index
        && approachingEventIndex() !== approachingEventConfirmedIndex()
    ));
    const isHighlighted = createMemo(() => (isApproaching() && blinkCycle() === 'high') || (!isApproaching() && isActive()));

    const flipBlinkCycle = () => {
        setBlinkCycle(blinkCycle() === 'high' ? 'low' : 'high');
    };

    createEffect(() => {
        if (isApproaching()) {
            setBlinkCycle('high');
        }
    });

    createEffect(on([blinkCycle, isApproaching], () => {
        if (!isApproaching()) {
            clearTimeout(blinkTimer);    
            return;
        }

        if (isApproaching()) {
            blinkTimer = setTimeout(flipBlinkCycle, EVENT_APPROACHING_BLINK_INTERVAL);
        }
    }));

    onCleanup(() => {
        clearTimeout(blinkTimer);
    });

    return (
        <Show when={width > 0}>
            <div
                class={cl('ec-event-item', {
                    tiny: width <= EVENT_MIN_BOX_SIZE,
                })}
                style={{
                    width: `${width}px`,
                    height: `${props.height}%`,
                    left: `${startPosition}px`,
                    'z-index': props.index,
                }}
            >
                <div class="ecei-content" style={{
                    opacity: brightness() / 100,
                    'background-color': isHighlighted() ? EVENT_COLORS[props.index] : '#000',
                    color: isHighlighted() ? '#000' : EVENT_COLORS[props.index],
                    '--pixel-border-color': EVENT_COLORS[props.index],
                }}>
                    <div class="ecei-time">
                        <div>
                            {timeUtils.getTimeString(startMinutes)}
                        </div>
                        <div>
                            {timeUtils.getTimeString(endMinutes)}
                        </div>
                    </div>
                    <div class="ecei-summary">
                        <div class="ecei-summary-text">{props.summary}</div>
                    </div>
                </div>
            </div>
        </Show>
    );
}