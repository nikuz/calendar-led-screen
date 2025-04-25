import { createMemo, createEffect, onCleanup } from 'solid-js';
import { useCalendarStateSelect } from 'src/state';

export default function EventsAlarm() {
    const approachingEventIndex = useCalendarStateSelect('approachingEventIndex');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');
    const approachingEventConfirmedIndex = useCalendarStateSelect('approachingEventConfirmedIndex');
    let approachingAlarmTimer: ReturnType<typeof setInterval>;
    let approachingAlarmRef: HTMLAudioElement | undefined;
    let eventAlarmTimer: ReturnType<typeof setInterval>;
    let eventAlarmRef: HTMLAudioElement | undefined;

    const isApproaching = createMemo(() => (
        approachingEventIndex() !== undefined
        && approachingEventIndex() !== approachingEventConfirmedIndex()
    ));

    const startApproachingAlarm = () => {
        clearInterval(approachingAlarmTimer);
        approachingAlarmRef?.play();
        approachingAlarmTimer = setInterval(() => {
            approachingAlarmRef?.play();
        }, 2000);
    };

    const stopApproachingAlarm = () => {
        clearInterval(approachingAlarmTimer);
        approachingAlarmRef?.pause();
        if (approachingAlarmRef) {
            approachingAlarmRef?.pause();
            if (approachingAlarmRef) {
                approachingAlarmRef.currentTime = 0;
            }
            approachingAlarmRef.currentTime = 0;
        }
    };

    const startAlarm = () => {
        clearInterval(eventAlarmTimer);
        if (eventAlarmRef) {
            eventAlarmRef.volume = 0.7;
        }
        eventAlarmRef?.play();
        eventAlarmTimer = setInterval(() => {
            eventAlarmRef?.pause();
            if (eventAlarmRef) {
                eventAlarmRef.currentTime = 0;
            }
            eventAlarmRef?.play();
        }, 7000);
    }

    const stopAlarm = () => {
        clearInterval(eventAlarmTimer);
        eventAlarmRef?.pause();
        if (eventAlarmRef) {
            eventAlarmRef.currentTime = 0;
        }
    }

    createEffect(() => {
        if (!approachingAlarmRef || !eventAlarmRef) {
            return;
        }

        if (isApproaching() && activeEventIndex() === undefined) {
            startApproachingAlarm();
            stopAlarm();
        } else if (isApproaching() && activeEventIndex() !== undefined) {
            stopApproachingAlarm();
            startAlarm();
        } else if (activeEventIndex() === undefined) {
            stopApproachingAlarm();
            stopAlarm();
        }
    });

    createEffect(() => {
        if (approachingEventIndex() === approachingEventConfirmedIndex()) {
            stopApproachingAlarm();
            stopAlarm();
        }
    });

    onCleanup(() => {
        stopApproachingAlarm();
        stopAlarm();
    });

    return <>
        <audio
            ref={approachingAlarmRef}
            src="/event-approaching-alarm.wav"
        />
        <audio
            ref={eventAlarmRef}
            src="/event-alarm.wav"
        />
    </>;
}