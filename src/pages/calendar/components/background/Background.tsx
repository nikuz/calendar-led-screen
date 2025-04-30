import { createMemo, createEffect, onMount, onCleanup } from 'solid-js';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import { timeUtils } from 'src/utils';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    CALENDAR_BACKGROUND_IMAGE,
} from 'src/constants';
import './Background.css';

export function Background() {
    const time = useCalendarStateSelect('time');
    const backgroundImageEnabled = useCalendarStateSelect('backgroundImageEnabled');
    const backgroundImageNightOverwriteEnabled = useCalendarStateSelect('backgroundImageNightOverwriteEnabled');

    const isNightTime = createMemo(() => timeUtils.isNightTime(time()));

    const backgroundImage = createMemo(() => {
        let cssImageProp = 'none';

        if (backgroundImageNightOverwriteEnabled() !== undefined) {
            if (backgroundImageNightOverwriteEnabled()) {
                cssImageProp = `url(${CALENDAR_BACKGROUND_IMAGE})`;
            }
        } else if (backgroundImageEnabled()) {
            cssImageProp = `url(${CALENDAR_BACKGROUND_IMAGE})`;
        }

        return cssImageProp;
    });
    
    const keydownHandler = (event: KeyboardEvent) => {

        if (event.code === 'KeyB') {
            let enabled;

            if (!event.ctrlKey) {
                enabled = backgroundImageNightOverwriteEnabled() === undefined
                    ? !backgroundImageEnabled()
                    : !backgroundImageNightOverwriteEnabled();
            }
            
            calendarStateActor.send({
                type: 'SET_BACKGROUND_IMAGE_NIGHT_OVERWRITE_ENABLED',
                enabled,
            });
        }
    };

    createEffect(() => {
        if (isNightTime() && backgroundImageEnabled()) {
            calendarStateActor.send({
                type: 'SET_BACKGROUND_IMAGE_ENABLED',
                enabled: false,
            });
        } else if (!isNightTime() && !backgroundImageEnabled()) {
            calendarStateActor.send({
                type: 'SET_BACKGROUND_IMAGE_ENABLED',
                enabled: true,
            });
        }
    });

    onMount(() => {
        document.addEventListener('keydown', keydownHandler);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keydownHandler);
    });

    return (
        <div
            id="background-container"
            style={{
                width: `${SCREEN_WIDTH}px`,
                height: `${SCREEN_HEIGHT}px`,
                'background-image': backgroundImage(),
            }}
        />
    );
}
