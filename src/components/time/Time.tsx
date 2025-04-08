import { onCleanup } from 'solid-js';
import { calendarStateActor, useCalendarStateSelect } from 'src/state';
import './Time.css';

export function Time() {
    const hour = useCalendarStateSelect('hour');
    const minute = useCalendarStateSelect('minute');

    const updateTime = () => {
        const now = new Date();

        calendarStateActor.send({
            type: 'SET_TIME',
            hour: now.getHours(),
            minute: now.getMinutes(),
        });
    };

    const timer = setInterval(updateTime, 1000);

    onCleanup(() => {
        clearInterval(timer);
    });

    return (
        <div id="time-container">
            {hour()}:{minute()}
        </div>
    );
}
