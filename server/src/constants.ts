import * as url from 'node:url';

export const __DIRNAME = url.fileURLToPath(new URL('.', import.meta.url));

export const BRIGHTNESS_SENSOR_I2C_BUS_NUMBER = 1;
export const BRIGHTNESS_SENSOR_I2C_ADDRESS = '0x23';
export const BRIGHTNESS_SENSOR_I2C_READ_REGISTRY = '0x05';
export const BRIGHTNESS_MIN = 0;
export const BRIGHTNESS_MAX = 65535;