import path from 'node:path';
import * as url from 'node:url';
import util from 'node:util';
import { exec } from 'node:child_process';
import type { Socket } from 'socket.io';
import { BRIGHTNESS_MAX } from '../../constants.ts';

const execPromise = util.promisify(exec);
const PYTHON_SCRIPT_PATH = path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'read_bh1750.py');

export class BrightnessSensorReader {
    socket: Socket | undefined;
    timer: ReturnType<typeof setTimeout> | undefined;
    isReading: boolean = false;

    constructor(socketInstance: Socket) {
        this.socket = socketInstance;
        this.readSensor();
    }

    scheduleRead = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.readSensor, 1000);
    };

    readSensor = async () => {
        clearTimeout(this.timer);

        if (!this.socket || this.isReading) {
            if (!this.socket) console.log('Socket closed, stopping reads.');
            if (this.isReading) console.log('Read already in progress, skipping.');
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            this.socket.emit('brightness', BRIGHTNESS_MAX);
            return;
        }

        this.isReading = true;
        
        const command = `python3 ${PYTHON_SCRIPT_PATH}`;

        try {
            const { stdout, stderr } = await execPromise(command);

            if (stderr && stderr.trim() !== '') {
                console.warn('python error:', stderr);
            }

            const brightness = parseInt(stdout.trim(), 16);

            this.socket.emit('brightness', brightness);
        } catch (error) {
            console.error('Error reading brightness sensor:', error);
        } finally {
            this.isReading = false;
            if (this.socket) {
                this.scheduleRead();
            }
        }
    };

    cleanup = () => {
        clearTimeout(this.timer);
        this.socket = undefined;
    };
}