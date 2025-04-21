import { CalendarEvent } from 'src/types';
import { CalendarStateContext } from '../types';

export function getActiveEvent(events: CalendarEvent[], time: Date): Partial<CalendarStateContext> {
    let activeEvent: CalendarEvent | undefined;
    let activeEventIndex: number | undefined;

    for (let i = 0, l = events.length; i < l; i++) {
        const event = events[i];
        const currentTime = time.getTime();
        const eventStart = new Date(event.start.dateTime).getTime();
        const eventEnd = new Date(event.end.dateTime).getTime();

        if (eventStart <= currentTime && eventEnd >= currentTime) {
            activeEvent = event;
            activeEventIndex = i;
            // proceed to check for nested events, the last one will be considered active
        }
    }

    return {
        activeEvent,
        activeEventIndex,
    };
}