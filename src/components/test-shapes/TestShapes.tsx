import { onMount } from 'solid-js';
import './TestShapes.css';

export function TestShapes() {
    let canvasEl: HTMLCanvasElement | undefined;;

    const canvasDrawHandler = () => {
        const ctx = canvasEl?.getContext('2d');
        if (!canvasEl || !ctx) {
            return;
        }
        
        // cube
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 50, 50);

        // triangle
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(70, 15);
        ctx.lineTo(120, 15);
        ctx.lineTo(95, 40);
        ctx.closePath();
        ctx.fill();

        // circle
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(150, 40, 20, 0, 360);
        ctx.fill();

        // horizontal line
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'yellow';
        ctx.beginPath();
        ctx.moveTo(200, 15.5);
        ctx.lineTo(295, 15.5);
        ctx.stroke();

        // vertical line
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(200.5, 17);
        ctx.lineTo(200.5, 70);
        ctx.stroke();

        // text 1
        ctx.fillStyle = 'white';
        ctx.font = '20px DejaVu Sans Mono';
        ctx.fillText('20:56', 10, 90);
    };

    onMount(() => {
        canvasDrawHandler();
    });

    return (
        <div id="test-shapes-container">
            <div class="tsc-square" />
            <div class="tsc-triangle" />
            <div class="tsc-circle" />

            <div class="tsc-lines">
                <div class="tscl-horizontal" />
                <div class="tscl-vertical" />
            </div>

            <div class="tsc-text">20:56</div>

            <canvas
                ref={canvasEl}
                class="tsc-canvas"
                width={300}
                height={100}
            />
        </div>
    );
}
