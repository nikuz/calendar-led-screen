import {
    TIME_NIGHT_TIME_LOW,
    TIME_NIGHT_TIME_HIGH,
} from '@calendar/constants';

export function isNightTime(time: Date) {
    const hours = time.getHours();
    return hours < TIME_NIGHT_TIME_LOW || hours > TIME_NIGHT_TIME_HIGH;
}