import { createResource, For, createEffect } from 'solid-js';
import { getTodaysCalendarEvents } from 'src/services';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';

export function Events() {
    const [eventsResource] = createResource(getTodaysCalendarEvents);
    const events = useCalendarStateSelect('events');

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

    return (
        <div>
            <For each={events()} fallback={<div>Loading...</div>}>
                {(item) => <div>{item.summary}</div>}
            </For>
        </div>
    );
}
