import { CalendarEvent } from 'src/types';

export interface CalendarStateContext {
    time: Date,
    timeIsHovered: boolean,
    
    events: CalendarEvent[],
    activeEvent?: number,

    brightness: number,
}

export interface SetTimeEvent {
    type: 'SET_TIME',
    time: Date,
}

export interface SetHoverTimeEvent {
    type: 'SET_HOVER_TIME',
    time: Date,
}

export interface RestoreTimeEvent { type: 'RESTORE_TIME' }

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
    | SetHoverTimeEvent
    | RestoreTimeEvent
    | SetEventsEvent
    | SetBrightnessEvent;