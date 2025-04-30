import { routerUtils } from 'src/utils';
import { DAY_START_TIME, DAY_END_TIME } from 'src/constants';
import {
    IGNORE_EVENTS_SUMMARY,
    EVENT_OVERLAP_HEIGHT_PUNISHMENT,
} from '@calendar/constants';
import { CalendarEvent } from '@calendar/types';

interface Props {
    from: string,
    to: string,
}

async function getCalendarEvents(props: Props): Promise<CalendarEvent[]> {
    const queryParams = new URLSearchParams({
        from: props.from,
        to: props.to,
    });

    const response = await fetch(routerUtils.withApiUrl(`/calendar-events?${queryParams}`));

    if (!response.ok) {
        throw response.status;
    }

    const events = (await response.json() as CalendarEvent[]).map(item => {
        const now = new Date();
        
        const itemStartDate = new Date(item.start.dateTime);
        const itemStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), itemStartDate.getHours(), itemStartDate.getMinutes());

        const itemEndDate = new Date(item.end.dateTime);
        const itemEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), itemEndDate.getHours(), itemEndDate.getMinutes());

        return {
            ...item,
            startDate: itemStart,
            endDate: itemEnd,
        };
    });
    
    events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const filteredEvents = events.filter((item) => {
        const eventStartTime = item.startDate.getHours() * 60 + item.startDate.getMinutes();
        return !IGNORE_EVENTS_SUMMARY.includes(item.summary.toLowerCase())
            && eventStartTime > DAY_START_TIME
            && eventStartTime < DAY_END_TIME;
    });

    let prevEventHeight = 100;

    for (let i = 0, l = filteredEvents.length; i < l; i++) {
        const event = filteredEvents[i];
        const prevEvent = filteredEvents[i - 1];

        if (!prevEvent) {
            event.height = 100;
            continue;
        }

        if (event.startDate < prevEvent.endDate) {
            event.height = prevEventHeight - EVENT_OVERLAP_HEIGHT_PUNISHMENT;
        } else {
            event.height = 100;
        }

        prevEventHeight = event.height;
    }

    return filteredEvents;
}

export async function getTodaysCalendarEvents(): Promise<CalendarEvent[]> {
    const now = new Date();
    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
    );

    return getCalendarEvents({
        from: today.toISOString(),
        to: tomorrow.toISOString(),
    });
}