import { createEffect } from 'solid-js';
import { useCalendarStateSelect } from 'src/state';

export default function EventsAlarm() {
    let approachingAlarmRef: HTMLAudioElement | undefined;
    let eventAlarmRef: HTMLAudioElement | undefined;
    const approachingEventIndex = useCalendarStateSelect('approachingEventIndex');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');

    createEffect(() => {
        if (!approachingAlarmRef || !eventAlarmRef) {
            return;
        }

        if (approachingEventIndex() !== undefined && activeEventIndex() === undefined) {
            approachingAlarmRef.play();
        } else if (activeEventIndex() !== undefined) {
            approachingAlarmRef.pause();
            approachingAlarmRef.currentTime = 0;
            eventAlarmRef.play();
        } else if (activeEventIndex() === undefined) {
            approachingAlarmRef.pause();
            approachingAlarmRef.currentTime = 0;
            eventAlarmRef.pause();
            eventAlarmRef.currentTime = 0;
        }
    });

    return <>
        <audio
            ref={approachingAlarmRef}
            src="/event-approaching-alarm.wav"
        />
        <audio
            ref={eventAlarmRef}
            src="/event-alarm.m4a"
        />
    </>;
}