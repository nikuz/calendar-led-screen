export interface GameStateContext {
    typingSamples: string[],

    focusedSampleIndex: number,
    selectedSampleIndex?: number,

    sampleCreatorIsOpen: boolean,

    hitCharacters: Map<number, boolean>,
    missCharacters: Map<number, boolean>,

    gameStartTime: number,
    gameStopTime: number,
    gameOver: boolean,
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

export interface HitCharacterEvent {
    type: 'HIT_CHARACTER',
    index: number,
}

export interface MissCharacterEvent {
    type: 'MISS_CHARACTER',
    index: number,
}

export interface GameOverEvent { type: 'GAME_OVER' }

export interface RestartEvent { type: 'RESTART' }

export type GameStateEvents =
    | OpenSampleCreatorEvent
    | CloseSampleCreatorEvent
    | FocusPrevSampleEvent
    | FocusNextSampleEvent
    | SelectSampleEvent
    | AddSampleEvent
    | HitCharacterEvent
    | MissCharacterEvent
    | GameOverEvent
    | RestartEvent;