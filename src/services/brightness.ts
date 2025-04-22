import { io } from 'socket.io-client';
import { calendarStateActor } from 'src/state';
import { remapValue } from 'src/utils';
import { BRIGHTNESS_MIN, BRIGHTNESS_MAX } from 'src/constants';

const socket = io(import.meta.env.VITE_API_URL);

socket.on('brightness', (value) => {
    calendarStateActor.send({
        type: 'SET_BRIGHTNESS',
        value: remapValue({
            value,
            inMin: BRIGHTNESS_MIN,
            inMax: BRIGHTNESS_MAX,
            outMin: 0,
            outMax: 100,
        }),
    });
});
