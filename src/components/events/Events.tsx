import { createResource, createEffect, createMemo, For, Show, on } from 'solid-js';
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
    const isNightTime = createMemo(() => timeUtils.isNightTime(time()));

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
        if (eventsResource() && !timeIsHovered() && !isNightTime()) {
            refetch();
        }
    }));

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
