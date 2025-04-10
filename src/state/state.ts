import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { CalendarStateContext, CalendarStateEvents } from './types';

const calendarState = () => {
    const [context, setContext] = createStore<CalendarStateContext>({
        time: new Date(),
        
        events: [],

        brightness: 100,
    });

    const send = (event: CalendarStateEvents) => {
        switch (event.type) {
            case 'SET_TIME':
                setContext('time', event.time);
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