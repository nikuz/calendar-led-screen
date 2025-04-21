import { onMount, onCleanup } from 'solid-js';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';

export default function EventsShortcutsManager() {
    const approachingEventIndex = useCalendarStateSelect('approachingEventIndex');

    const keydownHandler = (event: KeyboardEvent) => {
        if (event.code === 'Escape' && approachingEventIndex() !== undefined) {
            calendarStateActor.send({ type: 'CONFIRM_APPROACHING_EVENT' });
        }
    };

    onMount(() => {
        document.addEventListener('keydown', keydownHandler);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keydownHandler);
    });

    return null;
}