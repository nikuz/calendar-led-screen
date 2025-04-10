import { SetStoreFunction } from 'solid-js/store';
import { CalendarEvent } from 'src/types';
import { CalendarStateContext } from '../types';

export function setTimeAction(props: {
    context: CalendarStateContext,
    time: Date,
    timeIsHovered?: boolean,
    setContext: SetStoreFunction<CalendarStateContext>,
}) {
    const events = props.context.events;
    let activeEvent: CalendarEvent | undefined;
    let activeEventIndex: number | undefined;

    for (let i = 0, l = events.length; i < l; i++) {
        const event = events[i];
        const currentTime = props.time.getTime();
        const eventStart = new Date(event.start.dateTime).getTime();
        const eventEnd = new Date(event.end.dateTime).getTime();

        if (eventStart <= currentTime && eventEnd >= currentTime) {
            activeEvent = event;
            activeEventIndex = i;
            // proceed to check for nested events, the last one will be considered active
        }
    }

    props.setContext({
        time: props.time,
        timeIsHovered: props.timeIsHovered,
        activeEvent,
        activeEventIndex,
    });
}