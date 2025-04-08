import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { CalendarStateContext, CalendarStateEvents } from './types';

const calendarState = () => {
    const now = new Date();
    const [context, setContext] = createStore<CalendarStateContext>({
        hour: now.getHours(),
        minute: now.getMinutes(),

        events: [],

        brightness: 100,
    });

    const send = (event: CalendarStateEvents) => {
        switch (event.type) {
            case 'SET_TIME':
                setContext('hour', event.hour);
                setContext('minute', event.minute);
                break;
            
            case 'SET_EVENTS':
                setContext('events', event.events);
                break;
            
            case 'SET_BRIGHTNESS':
                setContext('brightness', event.value);
                break;
        }
    };

    return {
        context,
        send,
    };
};

export const calendarStateActor = createRoot(() => calendarState());