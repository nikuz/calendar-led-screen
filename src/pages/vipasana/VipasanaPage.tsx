import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAppStateSelect } from 'src/state';
import { Time } from '@calendar/components';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    ROUTER_HOME,
} from 'src/constants';
import './VipasanaPage.css';

export default function VipasanaPage() {
    const [timePosition, setTimePosition] = createSignal(0);
    const [timePositionMax, setTimePositionMax] = createSignal(0);
    const [paused, setPaused] = createSignal(false);
    const brightness = useAppStateSelect('brightness');
    const navigate = useNavigate();
    let playerElRef: HTMLAudioElement | undefined;

    const timeUpdateHandler = (event: Event) => {
        const target = event.target as HTMLAudioElement;

        if (target.duration && timePositionMax() === 0) {
            setTimePositionMax(target.duration);
        }
        setTimePosition(target.currentTime);
    };

    const rewindHandler = (timeStep: number) => {
        if (!playerElRef) {
            return;
        }
        playerElRef.currentTime = Math.min(
            Math.max(playerElRef.currentTime + timeStep, 0),
            playerElRef.duration
        );
    };
    
    const playToggleHandler = () => {
        if (!playerElRef) {
            return;
        }
        if (playerElRef.paused) {
            playerElRef.play();
            setPaused(false);
        } else {
            playerElRef.pause();   
            setPaused(true);
        }
    };

    const adjustVolumeHandler = (volumeStep: number) => {
        if (!playerElRef) {
            return;
        }
        playerElRef.volume = Math.min(
            Math.max(playerElRef.volume + volumeStep, 0.1),
            1
        );
    };
    
    const navigateToCalendarHandler = () => {
        navigate(ROUTER_HOME);
    };
    
    const keydownHandler = (event: KeyboardEvent) => {
        if (event.code === 'ArrowRight') {
            event.preventDefault();
            rewindHandler(event.shiftKey ? 60 : 1);
        }
        if (event.code === 'ArrowLeft') {
            event.preventDefault();
            rewindHandler(event.shiftKey ? -60 : -1);
        }
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            adjustVolumeHandler(0.1);
        }
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            adjustVolumeHandler(-0.1);
        }
        if (event.code === 'Space') {
            event.preventDefault();
            playToggleHandler();
        }
        if (event.code === 'Escape') {
            navigateToCalendarHandler();
        }
    };

    onMount(() => {
        document.addEventListener('keydown', keydownHandler);
        if (playerElRef) {
            playerElRef.volume = 0.5;
        }
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keydownHandler);
    });
    
    return (
        <div
            style={{
                width: `${SCREEN_WIDTH}px`,
                height: `${SCREEN_HEIGHT}px`,
                opacity: brightness() / 100,
            }}
        >
            <Time
                position={timePosition()}
                positionMin={1}
                positionMax={timePositionMax()}
                forceNight
            />
            <audio
                ref={playerElRef}
                src="/vipasana/vipasana.m4a"
                autoplay
                onTimeUpdate={timeUpdateHandler}
                onEnded={navigateToCalendarHandler}
            />
            <Show when={paused()}>
                <img
                    src="/icons/play.png"
                    class="vipasana-play-icon"
                />
            </Show>
        </div>
    );
}