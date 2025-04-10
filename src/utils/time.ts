import {
    TIME_NIGHT_TIME_LOW,
    TIME_NIGHT_TIME_HIGH,
} from 'src/constants';

export function formatTimeRange(minutesFrom: number, minutesTo: number) {
    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        let period = 'AM';
        let displayHours = hours;

        if (hours >= 12) {
            period = 'PM';
            displayHours = hours === 12 ? 12 : hours - 12;
        }
        if (hours === 0) {
            displayHours = 12;
        }

        return {
            time: mins === 0 ? `${displayHours}` : `${displayHours}:${mins.toString().padStart(2, '0')}`,
            period
        };
    };

    const from = formatTime(minutesFrom);
    const to = formatTime(minutesTo);

    // If periods are the same, only show it once at the end
    if (from.period === to.period) {
        return `${from.time} - ${to.time}${from.period}`;
    }

    // If periods are different, show both
    return `${from.time}${from.period} - ${to.time}${to.period}`;
}

export function padTimeNumber(value: number | string) {
    return String(value).padStart(2, '0');
}

export function isNightTime(time: Date) {
    const hours = time.getHours();
    return hours < TIME_NIGHT_TIME_LOW || hours > TIME_NIGHT_TIME_HIGH;
}