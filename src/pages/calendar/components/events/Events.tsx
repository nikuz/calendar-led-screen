import { createResource, createEffect, createMemo, For, Show, on, onCleanup } from 'solid-js';
import { remapValue } from 'src/utils';
import { SCREEN_WIDTH } from 'src/constants';
import { getTodaysCalendarEvents } from '@calendar/services';
import { calendarStateActor, useCalendarStateSelect } from '@calendar/state';
import { isNightTime } from '@calendar/utils';
import { 
    DAY_START_TIME,
    DAY_END_TIME,
    EVENTS_ZOOM,
} from '@calendar/constants';
import EventItem from './EventItem';
import EventsShortcutsManager from './EventsShortcutsManager';
import EventsAlarm from './EventsAlarm';
import EventsEffect from './EventsEffect';
import './Events.css';

export function Events() {
    const [eventsResource, { refetch }] = createResource(getTodaysCalendarEvents);
    const events = useCalendarStateSelect('events');
    const time = useCalendarStateSelect('time');
    const timeIsHovered = useCalendarStateSelect('timeIsHovered');
    let errorRefetchTimer: ReturnType<typeof setInterval> | undefined;

    const isNight = createMemo(() => isNightTime(time()));
    const resourceError = createMemo(() => eventsResource.error !== undefined);

    const marginLeft = createMemo(() => (
        Math.round(remapValue({
            value: time().getHours() * 60 + time().getMinutes(),
            inMin: DAY_START_TIME,
            inMax: DAY_END_TIME,
            outMin: 0,
            outMax: (SCREEN_WIDTH * EVENTS_ZOOM) / (EVENTS_ZOOM / (EVENTS_ZOOM - 1)),
        }))
    ));

    createEffect(() => {
        const receivedEvents = eventsResource();
        if (!receivedEvents) {
            return;
        }

        calendarStateActor.send({
            type: 'SET_EVENTS',
            events: receivedEvents,
        });
    });

    createEffect(on([time, timeIsHovered, isNight], () => {
        if (!timeIsHovered() && !isNight()) {
            refetch();
        }
    }));

    createEffect(on([resourceError], () => {
        errorRefetchTimer = setInterval(refetch, 1000);
    }));

    createEffect(on([eventsResource], () => {
        clearInterval(errorRefetchTimer);
    }));

    onCleanup(() => {
        clearInterval(errorRefetchTimer);
    });

    return <>
        <EventsEffect />
        
        <div id="events-container">
            <Show when={!isNight() && !eventsResource.error && events().length}>
                <div
                    id="ec-events"
                    style={{
                        left: `-${marginLeft()}px`,
                        transition: timeIsHovered() ? 'none' : 'left 100ms linear',
                    }}
                >
                    <For
                        each={events()}
                        fallback={<div id="events-loading">Events Loading...</div>}
                    >
                        {(item, index) => <EventItem {...item} index={index()} />}
                    </For>
                </div>
            </Show>

            <Show when={!isNight() && eventsResource.error}>
                <div id="ec-error">
                    Can't load events
                    <pre>
                        {eventsResource.error.toString()}
                    </pre>
                </div>
            </Show>

            <EventsShortcutsManager />
            
            <EventsAlarm />
        </div>
    </>;
}
