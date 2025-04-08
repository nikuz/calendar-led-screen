import { routerUtils } from 'src/utils';
import { IGNORE_EVENTS_SUMMARY } from 'src/constants';
import { CalendarEvent } from 'src/types';

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

    const events = await response.json() as CalendarEvent[];

    events.sort((a, b) => (
        new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime()
    ));

    return events.filter((item) => !IGNORE_EVENTS_SUMMARY.includes(item.summary.toLowerCase()));
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