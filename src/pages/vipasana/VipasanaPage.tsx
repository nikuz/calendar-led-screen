import { createSignal, createMemo, createEffect, onMount, onCleanup, For, Show, on } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import cl from 'classnames';
import { useAppStateSelect } from 'src/state';
import { Time } from '@calendar/components';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    ROUTER_HOME,
} from 'src/constants';
import { VOLUME_VISIBILITY_TIMEOUT } from './constants';
import './VipasanaPage.css';

export default function VipasanaPage() {
    const [timePosition, setTimePosition] = createSignal(0);
    const [timePositionMin] = createSignal(0.01);
    const [timePositionMax, setTimePositionMax] = createSignal(0);
    const [volume, setVolume] = createSignal(0.5);
    const [isVolumeVisible, setIsVolumeVisible] = createSignal(false);
    const [paused, setPaused] = createSignal(false);
    const brightness = useAppStateSelect('brightness');
    const navigate = useNavigate();
    let playerElRef: HTMLAudioElement | undefined;
    let volumeVisibilityTimer: ReturnType<typeof setTimeout> | undefined;

    const volumeBars = createMemo(() => {
        const bars = new Array<boolean>(10);
        for (let i = 1; i <= 10; i++) {
            bars[10 - i] = volume() * 10 >= i;
        }
        return bars;
    });

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
        const roundedVolume = Number((playerElRef.volume + volumeStep).toFixed(1));
        const newVolume = Math.min(Math.max(roundedVolume, 0.1), 1);
        playerElRef.volume = newVolume;
        setVolume(newVolume);
        setIsVolumeVisible(true);
    };

    createEffect(on([volume, isVolumeVisible], () => {
        clearTimeout(volumeVisibilityTimer);
        if (isVolumeVisible()) {
            volumeVisibilityTimer = setTimeout(() => {
                setIsVolumeVisible(false);
            }, VOLUME_VISIBILITY_TIMEOUT);
        }
    }));
    
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
            playerElRef.volume = volume();
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
                cursor: 'none',
            }}
        >
            <Time
                position={timePosition()}
                positionMin={timePositionMin()}
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
            <div class={cl('vipasana-volume-bars', {
                visible: isVolumeVisible(),
                fading: !isVolumeVisible(),
            })}>
                <For each={volumeBars()}>
                    {(item) => (
                        <div
                            class={cl('vipasana-volume-bar-item', {
                                filled: item === true,
                            })}
                            style={{
                                opacity: brightness() / 100,
                            }}
                        />
                    )}
                </For>
            </div>
            <Show when={paused()}>
                <img
                    src="/icons/play.png"
                    class="vipasana-play-icon"
                    style={{
                        opacity: brightness() / 100,
                    }}
                />
            </Show>
        </div>
    );
}