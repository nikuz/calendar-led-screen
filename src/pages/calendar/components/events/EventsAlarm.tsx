import { createSignal, createMemo, createEffect, onMount, onCleanup, Show } from 'solid-js';
import { useCalendarStateSelect } from 'src/state';
import { 
    ALARM_APPROACHING_SRC,
    ALARM_APPROACHING_LOOP_DURATION,
    ALARM_APPROACHING_VOLUME,
    ALARM_SRC,
    ALARM_LOOP_DURATION,
    ALARM_TOTAL_DURATION,
    ALARM_VOLUME,
} from 'src/constants';

export default function EventsAlarm() {
    const approachingEventIndex = useCalendarStateSelect('approachingEventIndex');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');
    const approachingEventConfirmedIndex = useCalendarStateSelect('approachingEventConfirmedIndex');
    const isMuted = useCalendarStateSelect('isMuted');
    const [isFocused, setIsFocused] = createSignal(true);
    let approachingAlarmTimer: ReturnType<typeof setInterval>;
    let approachingAlarmRef: HTMLAudioElement | undefined;
    let eventAlarmTimer: ReturnType<typeof setInterval>;
    let eventAlarmDuration = 0;
    let eventAlarmRef: HTMLAudioElement | undefined;

    const isApproaching = createMemo(() => (
        approachingEventIndex() !== undefined
        && approachingEventIndex() !== approachingEventConfirmedIndex()
    ));

    const startApproachingAlarm = () => {
        clearInterval(approachingAlarmTimer);

        if (isMuted()) {
            return;
        }

        if (approachingAlarmRef) {
            approachingAlarmRef.volume = ALARM_APPROACHING_VOLUME;
        }

        approachingAlarmRef?.play();
        approachingAlarmTimer = setInterval(() => {
            approachingAlarmRef?.play();
        }, ALARM_APPROACHING_LOOP_DURATION);
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

        if (isMuted()) {
            return;
        }

        if (eventAlarmRef) {
            eventAlarmRef.volume = ALARM_VOLUME;
        }
        eventAlarmRef?.play();
        eventAlarmTimer = setInterval(() => {
            eventAlarmRef?.pause();
            if (eventAlarmRef) {
                eventAlarmRef.currentTime = 0;
            }

            eventAlarmDuration += ALARM_LOOP_DURATION;
            if (eventAlarmDuration >= ALARM_TOTAL_DURATION) {
                clearInterval(eventAlarmTimer);
            } else {
                eventAlarmRef?.play();
            }
        }, ALARM_LOOP_DURATION);
    };

    const stopAlarm = () => {
        clearInterval(eventAlarmTimer);
        eventAlarmRef?.pause();
        if (eventAlarmRef) {
            eventAlarmRef.currentTime = 0;
        }
        eventAlarmDuration = 0;
    };

    const windowFocusHandler = () => {
        setIsFocused(true);
    };
    
    const windowBlurHandler = () => {
        setIsFocused(false);
    };

    createEffect(() => {
        if (!approachingAlarmRef || !eventAlarmRef || !isFocused()) {
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
        if (approachingEventIndex() === approachingEventConfirmedIndex() || isMuted() || !isFocused()) {
            stopApproachingAlarm();
            stopAlarm();
        }
    });

    onMount(() => {
        window.addEventListener('focus', windowFocusHandler);
        window.addEventListener('blur', windowBlurHandler);
    });

    onCleanup(() => {
        stopApproachingAlarm();
        stopAlarm();
        window.removeEventListener('focus', windowFocusHandler);
        window.removeEventListener('blur', windowBlurHandler);
    });

    return <>
        <audio
            ref={approachingAlarmRef}
            src={ALARM_APPROACHING_SRC}
        />
        <audio
            ref={eventAlarmRef}
            src={ALARM_SRC}
        />
        <Show when={isMuted()}>
            <img
                src="/icons/mute.png"
                class="ec-event-alarm-icon"
            />
        </Show>
        <Show when={!isMuted()}>
            <img
                src="/icons/speaker.png"
                class="ec-event-alarm-icon"
            />
        </Show>
    </>;
}