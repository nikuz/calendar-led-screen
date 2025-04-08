import { createMemo, Accessor } from 'solid-js';
import { calendarStateActor } from '../../state';
import { CalendarStateContext } from '../../types';

export function useCalendarStateSelect<K extends keyof CalendarStateContext>(key: K): Accessor<CalendarStateContext[K]> {
    const value = createMemo(() => calendarStateActor.context[key]);

    return value;
}