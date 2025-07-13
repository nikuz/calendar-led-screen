export const IGNORE_EVENTS_SUMMARY = ['busy'];
export const IGNORE_EVENTS_STATUS = ['canceled'];
export const IGNORE_EVENTS_TRANSPARENCY = ['transparent'];

// time
export const TIME_COLOR = '#FFF';
export const TIME_NIGHT_COLOR = '#F00';
export const TIME_FONT_SIZE = 48; // px
export const TIME_FONT_SIZE_NIGHT_TIME = 80; // px
export const TIME_POINTER_WIDTH = 1; // px
export const TIME_NIGHT_TIME_LOW = 7;
export const TIME_NIGHT_TIME_HIGH = 19;

// events
export const EVENT_MIN_BOX_SIZE = 40; // px
export const EVENT_APPROACHING_THRESHOLD = 1000 * 60; // ms
export const EVENT_APPROACHING_BLINK_INTERVAL = 1000; // ms
export const EVENT_OVERLAP_HEIGHT_PUNISHMENT = 20; // %
export const EVENTS_ZOOM = 1.35; // times
export const EVENT_COLORS = [
    '#00ffff',    // Cyan
    '#ff4500',    // Orange Red
    '#ffa600',    // Orange
    '#8a2be2',    // Blue Violet
    '#ff00ff',    // Magenta
    '#8b4513',    // Brown
    '#32cd32',    // Lime
    '#ffd900',    // Gold
    '#40e0d0',    // Turquoise
    '#ffc0cb',    // Pink
    '#dc143c',    // Crimson
    '#e6e6fa',    // Lavender
    '#808000',    // Olive
    '#00ff7f',    // Spring Green
    '#4682b4',    // Steel Blue
    '#daa520',    // Goldenrod
    '#ff69b4',    // Hot Pink
    '#228b22',    // Forest Green
    '#800000',    // Maroon
];

// alarm
export const ALARM_APPROACHING_SRC = '/sounds/event-approaching-alarm.wav';
export const ALARM_APPROACHING_LOOP_DURATION = 2000; // ms
export const ALARM_APPROACHING_VOLUME = 1;
export const ALARM_SRC = '/sounds/event-alarm.wav';
export const ALARM_LOOP_DURATION = 7000; // ms
export const ALARM_TOTAL_DURATION = 60 * 1000; // ms
export const ALARM_VOLUME = 0.7;

// background
export const CALENDAR_BACKGROUND_IMAGE = '/images/mountains-night.jpg';