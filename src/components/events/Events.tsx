import { createResource, createEffect, createMemo, For, Show, on, onCleanup } from 'solid-js';
import { getTodaysCalendarEvents } from 'src/services';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { timeUtils } from 'src/utils';
import EventItem from './EventItem';
import EventsShortcutsManager from './EventsShortcutsManager';
import './Events.css';

export function Events() {
    const [eventsResource, { refetch }] = createResource(getTodaysCalendarEvents);
    const events = useCalendarStateSelect('events');
    const time = useCalendarStateSelect('time');
    const timeIsHovered = useCalendarStateSelect('timeIsHovered');
    let errorRefetchTimer: ReturnType<typeof setInterval> | undefined;

    const isNightTime = createMemo(() => timeUtils.isNightTime(time()));
    const resourceError = createMemo(() => eventsResource.error !== undefined);

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
        <div id="events-container">
            <Show when={!isNightTime() && !eventsResource.error && events().length}>
                <For
                    each={events()}
                    fallback={<div id="events-loading">Events Loading...</div>}
                >
                    {(item, index) => <EventItem {...item} index={index()} />}
                </For>
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
        </div>
    );
}
