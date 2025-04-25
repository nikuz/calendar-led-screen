import { createResource, createEffect, createMemo, For, Show, on, onCleanup } from 'solid-js';
import { getTodaysCalendarEvents } from 'src/services';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import {
    SCREEN_WIDTH,
    DAY_START_TIME,
    DAY_END_TIME,
    EVENTS_ZOOM,
} from 'src/constants';
import EventItem from './EventItem';
import EventsShortcutsManager from './EventsShortcutsManager';
import EventsAlarm from './EventsAlarm';
import './Events.css';

export function Events() {
    const [eventsResource, { refetch }] = createResource(getTodaysCalendarEvents);
    const events = useCalendarStateSelect('events');
    const time = useCalendarStateSelect('time');
    const timeIsHovered = useCalendarStateSelect('timeIsHovered');
    let errorRefetchTimer: ReturnType<typeof setInterval> | undefined;

    const isNightTime = createMemo(() => timeUtils.isNightTime(time()));
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

    createEffect(on([time, timeIsHovered, isNightTime], () => {
        if (!timeIsHovered() && !isNightTime()) {
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

    return (
        <div>
            <Show when={!isNightTime() && !eventsResource.error && events().length}>
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

            <Show when={!isNightTime() && eventsResource.error}>
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
    );
}
