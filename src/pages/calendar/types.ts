export interface CalendarEvent {
    summary: string,
    start: CalendarTime,
    startDate: Date,
    end: CalendarTime,
    endDate: Date,
    creator: {
        email: string,
    },
    height: number,
    status: string,
    transparency: string,
}

export interface CalendarTime {
    dateTime: string,
    timeZone: string,
}