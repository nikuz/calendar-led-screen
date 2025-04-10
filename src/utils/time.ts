import {
    TIME_NIGHT_TIME_LOW,
    TIME_NIGHT_TIME_HIGH,
} from 'src/constants';

export function getTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let displayHours = hours;

    if (hours >= 12) {
        displayHours = hours === 12 ? 12 : hours - 12;
    }
    if (hours === 0) {
        displayHours = 12;
    }

    return mins === 0 ? `${displayHours}` : `${displayHours}:${mins.toString().padStart(2, '0')}`;
}

export function formatTimeRange(minutesFrom: number, minutesTo: number) {
    const from = getTimeString(minutesFrom);
    const to = getTimeString(minutesTo);

    return `${from} - ${to}`;
}

export function padTimeNumber(value: number | string) {
    return String(value).padStart(2, '0');
}

export function isNightTime(time: Date) {
    const hours = time.getHours();
    return hours < TIME_NIGHT_TIME_LOW || hours > TIME_NIGHT_TIME_HIGH;
}