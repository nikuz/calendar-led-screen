import { createSignal, createEffect, onCleanup } from 'solid-js';
import { useCalendarStateSelect } from 'src/state';
import { remapValue } from 'src/utils';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    DAY_START_TIME,
    DAY_END_TIME,
    EVENTS_ZOOM,
    EVENT_COLORS,
} from 'src/constants';

export default function EventsEffect() {
    const activeEvent = useCalendarStateSelect('activeEvent');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');
    const approachingEventConfirmedIndex = useCalendarStateSelect('approachingEventConfirmedIndex');
    const time = useCalendarStateSelect('time');
    const [effectPosition, setEffectPosition] = createSignal(0);
    const [effectColor, setEffectColor] = createSignal('#FFF');
    let canvasElRef: HTMLCanvasElement | undefined;
    let animationFrameId: ReturnType<typeof requestAnimationFrame>;
    let offset = 0;

    const animate = () => {
        const ctx = canvasElRef?.getContext('2d');
        if (!canvasElRef || !ctx) {
            return;
        }

        const width = canvasElRef.clientWidth;
        const height = canvasElRef.clientHeight;

        ctx.clearRect(0, 0, width, height);

        // Constants for wave calculation
        const waveSpeed = 0.4;
        const centerY = height - 20;
        const maxRadius = Math.sqrt(width * width + height * height);
        const waveCount = 35;
        const waveSpacing = maxRadius / waveCount;
        const lineWidth = 2;

        // Update offset for animation
        offset = (offset + waveSpeed) % waveSpacing;

        // Draw all waves
        for (let i = 0; i < waveCount; i++) {
            const radius = offset + i * waveSpacing;

            // Skip if radius is too small
            if (radius < 1) continue;

            // Calculate opacity based on radius
            const opacity = 0.8 - (radius / maxRadius) * 0.7;

            // Draw the wave
            ctx.beginPath();
            ctx.arc(effectPosition(), centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = effectColor();
            ctx.globalAlpha = opacity;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }

        // Reset global alpha
        ctx.globalAlpha = 1;

        // Continue animation loop
        if (activeEvent()) {
            animationFrameId = requestAnimationFrame(animate);
        }
    };

    const showEffect = () => {
        cancelAnimationFrame(animationFrameId);

        const event = activeEvent();
        const eventIndex = activeEventIndex();
        if (!event || eventIndex === undefined) {
            return;
        }

        const startMinutes = event.startDate.getHours() * 60 + event.startDate.getMinutes();
        const startPosition = Math.round(remapValue({
            value: startMinutes,
            inMin: DAY_START_TIME,
            inMax: DAY_END_TIME,
            outMin: 0,
            outMax: SCREEN_WIDTH * EVENTS_ZOOM,
        }));
        const endMinutes = event.endDate.getHours() * 60 + event.endDate.getMinutes();
        const endPosition = Math.round(remapValue({
            value: endMinutes,
            inMin: DAY_START_TIME,
            inMax: DAY_END_TIME,
            outMin: 0,
            outMax: SCREEN_WIDTH * EVENTS_ZOOM,
        }));
        const eventWidth = endPosition - startPosition;
        const marginLeft = Math.round(remapValue({
            value: time().getHours() * 60 + time().getMinutes(),
            inMin: DAY_START_TIME,
            inMax: DAY_END_TIME,
            outMin: 0,
            outMax: (SCREEN_WIDTH * EVENTS_ZOOM) / (EVENTS_ZOOM / (EVENTS_ZOOM - 1)),
        }));

        setEffectPosition((startPosition + (eventWidth / 2) - marginLeft));
        setEffectColor(EVENT_COLORS[eventIndex]);

        animationFrameId = requestAnimationFrame(animate);
    };

    const hideEffect = () => {
        cancelAnimationFrame(animationFrameId);
        const ctx = canvasElRef?.getContext('2d');
        if (canvasElRef && ctx) {
            ctx.clearRect(0, 0, canvasElRef.clientWidth, canvasElRef.clientHeight);
        }
    };

    createEffect(() => {
        if (activeEvent() && activeEventIndex() !== approachingEventConfirmedIndex()) {
            showEffect();
        } else {
            hideEffect();
        }
    });

    onCleanup(() => {
        cancelAnimationFrame(animationFrameId);
    });

    return (
        <canvas
            class="ec-event-effect-canvas"
            ref={canvasElRef}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
        />
    );
}