import { createResource, createEffect, createMemo, For, Show, on } from 'solid-js';
import { getTodaysCalendarEvents } from 'src/services';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { timeUtils } from 'src/utils';
import EventItem from './EventItem';
import './Events.css';

export function Events() {
    const [eventsResource, { refetch }] = createResource(getTodaysCalendarEvents);
    const events = useCalendarStateSelect('events');
    const hour = useCalendarStateSelect('hour');
    const minute = useCalendarStateSelect('minute');
    const isNightTime = createMemo(() => timeUtils.isNightTime(hour()));

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

    createEffect(on(minute, () => {
        if (eventsResource() && !isNightTime()) {
            refetch();
        }
    }));

    return (
        <Show when={!isNightTime()}>
            <div id="events-container">
                <For
                    each={events()}
                    fallback={<div id="events-loading">Loading...</div>}
                >
                    {(item, index) => <EventItem {...item} index={index()} />}
                </For>
            </div>
        </Show>
    );
}
