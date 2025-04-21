import { createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { getActiveEvent, getApproachingEvent } from './utils';
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
                setContext({
                    time: event.time,
                    ...getActiveEvent(context.events, event.time),
                    ...getApproachingEvent(context, context.events, event.time),
                });
                break;
            
            case 'SET_HOVER_TIME':
                setContext({
                    time: event.time,
                    timeIsHovered: true,
                    ...getActiveEvent(context.events, event.time),
                    ...getApproachingEvent(context, context.events, event.time),
                });
                break;
            
            case 'RESTORE_TIME': {
                const newTime = new Date();
                setContext({
                    time: newTime,
                    timeIsHovered: false,
                    ...getActiveEvent(context.events, newTime),
                    ...getApproachingEvent(context, context.events, newTime),
                });
                break;
            }
            
            case 'SET_EVENTS':
                setContext({
                    events: event.events,
                    ...getActiveEvent(event.events, context.time),
                    ...getApproachingEvent(context, event.events, context.time),
                });
                break;
            
            case 'SET_BRIGHTNESS':
                setContext('brightness', event.value);
                break;
            
            case 'CONFIRM_APPROACHING_EVENT':
                setContext('approachingEventConfirmedIndex', context.approachingEventIndex);
                break;
        }
    };

    return {
        context,
        send,
    };
};

export const calendarStateActor = createRoot(() => calendarState());