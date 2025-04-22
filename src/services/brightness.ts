import { io } from 'socket.io-client';
import { calendarStateActor } from 'src/state';
import { remapValue } from 'src/utils';
import {
    BRIGHTNESS_SENSOR_VALUE_MIN,
    BRIGHTNESS_SENSOR_VALUE_MAX,
    BRIGHTNESS_MIN,
    BRIGHTNESS_MAX,
} from 'src/constants';

const socket = io(import.meta.env.VITE_API_URL);

socket.on('brightness', (value) => {
    calendarStateActor.send({
        type: 'SET_BRIGHTNESS',
        value: remapValue({
            value,
            inMin: BRIGHTNESS_SENSOR_VALUE_MIN,
            inMax: BRIGHTNESS_SENSOR_VALUE_MAX,
            outMin: BRIGHTNESS_MIN,
            outMax: BRIGHTNESS_MAX,
        }),
    });
});
