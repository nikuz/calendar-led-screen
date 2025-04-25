import { createEffect } from 'solid-js';
import { useCalendarStateSelect } from 'src/state';

export default function EventsAlarm() {
    let approachingAlarmRef: HTMLAudioElement | undefined;
    const approachingEventIndex = useCalendarStateSelect('approachingEventIndex');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');

    createEffect(() => {
        if (approachingEventIndex() !== undefined && activeEventIndex() === undefined) {
            approachingAlarmRef?.play();
        }
    });

    return (
        <audio
            ref={approachingAlarmRef}
            src="/event-approaching-alarm.wav"
        />
    );
}