export interface CalendarEvent {
    summary: string,
    start: CalendarTime,
    end: CalendarTime,
}

export interface CalendarTime {
    dateTime: string,
    timeZone: string,
}