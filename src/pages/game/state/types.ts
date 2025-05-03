export interface GameStateContext {
    typingSamples: string[],

    focusedSampleIndex: number,
    selectedSampleIndex?: number,

    sampleCreatorIsOpen: boolean,
}

export interface OpenSampleCreatorEvent { type: 'OPEN_SAMPLE_CREATOR' }

export interface CloseSampleCreatorEvent { type: 'CLOSE_SAMPLE_CREATOR' }

export interface FocusPrevSampleEvent { type: 'FOCUS_PREV_SAMPLE' }

export interface FocusNextSampleEvent { type: 'FOCUS_NEXT_SAMPLE' }

export interface SelectSampleEvent {
    type: 'SELECT_SAMPLE',
    sampleIndex: number,
}

export interface AddSampleEvent {
    type: 'ADD_SAMPLE',
    sample: string,
}

export type GameStateEvents =
    | OpenSampleCreatorEvent
    | CloseSampleCreatorEvent
    | FocusPrevSampleEvent
    | FocusNextSampleEvent
    | SelectSampleEvent
    | AddSampleEvent;