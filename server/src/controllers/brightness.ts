import util from 'node:util';
import { exec } from 'node:child_process';
import type { Socket } from 'socket.io';
import {
    BRIGHTNESS_SENSOR_I2C_BUS_NUMBER,
    BRIGHTNESS_SENSOR_I2C_ADDRESS,
    BRIGHTNESS_SENSOR_I2C_READ_REGISTRY,
    BRIGHTNESS_MAX,
} from '../constants.ts';

const execPromise = util.promisify(exec);
let socket: Socket | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;

enum I2CCommand {
    READ_ONE_TIM_HIGH_RES = 0x20,
};

let prevBrightnessRead = 0;

// i2c-tools: https://www.kali.org/tools/i2c-tools/
async function readSensorHandler() {
    if (!socket) {
        return;
    }

    if (process.env.NODE_ENV === 'development') {
        socket.emit('brightness', BRIGHTNESS_MAX);
        return;
    }

    await execPromise(`sudo i2cset -y ${BRIGHTNESS_SENSOR_I2C_BUS_NUMBER} ${BRIGHTNESS_SENSOR_I2C_ADDRESS} ${I2CCommand.READ_ONE_TIM_HIGH_RES}`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const { stdout, stderr } = await execPromise(`sudo i2cget -y ${BRIGHTNESS_SENSOR_I2C_BUS_NUMBER} ${BRIGHTNESS_SENSOR_I2C_ADDRESS} ${BRIGHTNESS_SENSOR_I2C_READ_REGISTRY} w`);

    if (stderr !== '') {
        console.error('stderr', stderr);
        return;
    }

    const brightness = parseInt(stdout.trim(), 16);

    if (prevBrightnessRead !== brightness) {
        prevBrightnessRead = brightness;
        socket.emit('brightness', brightness);
        timer = setTimeout(readSensorHandler, 1000);
    }
}

export function startReadingTimer(socketInstance: Socket) {
    socket = socketInstance;
    clearTimeout(timer);
    readSensorHandler();
}

export function stopReadingTimer() {
    socket = undefined;
    clearTimeout(timer);
}