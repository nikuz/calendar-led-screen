import { CalendarEvent } from 'src/types';

export interface CalendarStateContext {
    hour: number,
    minute: number,

    events: CalendarEvent[],
    activeEvent?: number,

    brightness: number,
}

export interface SetTimeEvent {
    type: 'SET_TIME',
    hour: number,
    minute: number,
}

export interface SetEventsEvent {
    type: 'SET_EVENTS',
    events: CalendarEvent[],
}

export interface SetBrightnessEvent {
    type: 'SET_BRIGHTNESS',
    value: number,
}

export type CalendarStateEvents =
    | SetTimeEvent
    | SetEventsEvent
    | SetBrightnessEvent;