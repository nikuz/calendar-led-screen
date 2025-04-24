import { io } from 'socket.io-client';
import { calendarStateActor } from 'src/state';
import { remapValue, timeUtils } from 'src/utils';
import {
    BRIGHTNESS_SENSOR_VALUE_MIN,
    BRIGHTNESS_SENSOR_VALUE_MAX,
    NIGHT_BRIGHTNESS_SENSOR_VALUE_MAX,
    BRIGHTNESS_MIN,
    NIGHT_BRIGHTNESS_MIN,
    BRIGHTNESS_MAX,
} from 'src/constants';

const socket = io(import.meta.env.VITE_API_URL);
let prevBrightness = 0;

socket.on('brightness', (value) => {
    const isNight = timeUtils.isNightTime(new Date());
    const brightness = Math.round(remapValue({
        value,
        inMin: BRIGHTNESS_SENSOR_VALUE_MIN,
        inMax: isNight ? NIGHT_BRIGHTNESS_SENSOR_VALUE_MAX : BRIGHTNESS_SENSOR_VALUE_MAX,
        outMin: isNight ? NIGHT_BRIGHTNESS_MIN : BRIGHTNESS_MIN,
        outMax: BRIGHTNESS_MAX,
    }));

    if (brightness !== prevBrightness) {
        prevBrightness = brightness;
        calendarStateActor.send({
            type: 'SET_BRIGHTNESS',
            value: brightness,
        });
    }
});
