import { calendarStateActor } from 'src/state';
import { Time, Events } from 'src/components';
import { remapValue } from 'src/utils';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'src/constants';
import './App.css';

export default function App() {
    const mouseMoveHandler = (event: MouseEvent) => {
        const now = new Date();
        const minutes = Math.round(remapValue({
            value: event.clientX,
            inMin: 0,
            inMax: SCREEN_WIDTH - 1,
            outMin: 0,
            outMax: 24 * 60 - 1,
        }));
        const hours = Math.floor(minutes / 60);

        calendarStateActor.send({
            type: 'SET_HOVER_TIME',
            time: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hours,
                minutes % 60,
            ),
        });
    };

    const mouseLeaveHandler = () => {
        calendarStateActor.send({ type: 'RESTORE_TIME' });
    };

    return (
        <div
            id="app-container"
            style={{
                width: `${SCREEN_WIDTH}px`,
                height: `${SCREEN_HEIGHT}px`,
            }}
            onMouseMove={mouseMoveHandler}
            onMouseLeave={mouseLeaveHandler}
        >
            <Time />
            <Events />
        </div>
    );
}
