import { CalendarEvent } from '@calendar/types';

export interface CalendarStateContext {
    time: Date,
    timeIsHovered: boolean,
    
    events: CalendarEvent[],

    activeEvent?: CalendarEvent,
    activeEventIndex?: number,

    approachingEvent?: CalendarEvent,
    approachingEventIndex?: number,
    approachingEventConfirmedIndex?: number, // is set when user confirms the approaching event by keyboard press

    isMuted: boolean,

    backgroundImageEnabled: boolean,
    backgroundImageNightOverwriteEnabled?: boolean,
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

export interface ConfirmApproachingEvent { type: 'CONFIRM_APPROACHING_EVENT' }

export interface SetMutedEvent {
    type: 'SET_MUTED',
    muted: boolean,
}

export interface SetBackgroundImageEnabledEvent {
    type: 'SET_BACKGROUND_IMAGE_ENABLED',
    enabled: boolean,
}

export interface SetBackgroundImageNightOverwriteEnabledEvent {
    type: 'SET_BACKGROUND_IMAGE_NIGHT_OVERWRITE_ENABLED',
    enabled?: boolean,
}

export type CalendarStateEvents =
    | SetTimeEvent
    | SetHoverTimeEvent
    | RestoreTimeEvent
    | SetEventsEvent
    | ConfirmApproachingEvent
    | SetMutedEvent
    | SetBackgroundImageEnabledEvent
    | SetBackgroundImageNightOverwriteEnabledEvent;