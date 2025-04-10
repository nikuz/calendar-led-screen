import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { setTimeAction } from './actions';
import { CalendarStateContext, CalendarStateEvents } from './types';

const calendarState = () => {
    const [context, setContext] = createStore<CalendarStateContext>({
        time: new Date(),
        timeIsHovered: false,
        
        events: [],

        brightness: 100,
    });

    const send = (event: CalendarStateEvents) => {
        switch (event.type) {
            case 'SET_TIME':
                setTimeAction({
                    context,
                    time: event.time,
                    setContext,
                });
                break;
            
            case 'SET_HOVER_TIME':
                setTimeAction({
                    context,
                    time: event.time,
                    timeIsHovered: true,
                    setContext,
                });
                break;
            
            case 'RESTORE_TIME':
                setTimeAction({
                    context,
                    time: new Date(),
                    timeIsHovered: false,
                    setContext,
                });
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