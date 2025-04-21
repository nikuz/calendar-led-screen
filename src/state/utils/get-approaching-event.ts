import { CalendarEvent } from 'src/types';
import { EVENT_APPROACHING_THRESHOLD } from 'src/constants';
import { CalendarStateContext } from '../types';

export function getApproachingEvent(context: CalendarStateContext, events: CalendarEvent[], time: Date): Partial<CalendarStateContext> {
    let approachingEvent: CalendarEvent | undefined;
    let approachingEventIndex: number | undefined;

    for (let i = 0, l = events.length; i < l; i++) {
        const event = events[i];
        const currentTime = time.getTime();
        const eventStart = new Date(event.start.dateTime).getTime();
        const eventEnd = new Date(event.end.dateTime).getTime();

        if ((eventStart - currentTime > 0 && eventStart - currentTime <= EVENT_APPROACHING_THRESHOLD) || (eventStart <= currentTime && eventEnd >= currentTime)) {
            approachingEvent = event;
            approachingEventIndex = i;
            break;
        }
    }

    const contextUpdate: Partial<CalendarStateContext> = {
        approachingEvent,
        approachingEventIndex,
    };

    if (approachingEventIndex === undefined && context.approachingEventConfirmedIndex !== undefined) {
        contextUpdate.approachingEventConfirmedIndex = undefined;
    }

    return contextUpdate;
}