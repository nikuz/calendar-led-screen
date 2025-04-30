export interface AppStateContext {
    brightness: number,
}

export interface SetBrightnessEvent {
    type: 'SET_BRIGHTNESS',
    value: number,
}

export type AppStateEvents =
    | SetBrightnessEvent;