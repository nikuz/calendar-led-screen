import { createEffect, onCleanup, on } from 'solid-js';
import { useCalendarStateSelect } from 'src/state';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'src/constants';

export default function EventsEffect() {
    const activeEvent = useCalendarStateSelect('activeEvent');
    const activeEventIndex = useCalendarStateSelect('activeEventIndex');
    const approachingEventConfirmedIndex = useCalendarStateSelect('approachingEventConfirmedIndex');
    const waveSpeed = 0.4;
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
        const centerX = width / 2;
        const centerY = height - 20;
        const maxRadius = Math.sqrt(width * width + height * height) / 2;
        const waveCount = 20;
        const waveSpacing = maxRadius / waveCount;
        const lineWidth = 2;
        const waveColor = '#F8E71C';

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
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = waveColor;
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
        animate();
    }

    const hideEffect = () => {
        cancelAnimationFrame(animationFrameId);
        const ctx = canvasElRef?.getContext('2d');
        if (canvasElRef && ctx) {
            ctx.clearRect(0, 0, canvasElRef.clientWidth, canvasElRef.clientHeight);
        }
    }

    createEffect(on([activeEvent, activeEventIndex, approachingEventConfirmedIndex], () => {
        if (activeEvent() && activeEventIndex() !== approachingEventConfirmedIndex()) {
            showEffect();
        } else {
            hideEffect();
        }
    }));

    onCleanup(() => {
        cancelAnimationFrame(animationFrameId);
    });

    return (
        <canvas
            ref={canvasElRef}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
        />
    );
}