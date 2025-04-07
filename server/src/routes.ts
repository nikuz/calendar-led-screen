import path from 'node:path';
import type { Express } from 'express';
import { calendarControllers } from './controllers/index.ts';
import { __DIRNAME } from './constants.ts';

const UIBuildPath = path.resolve(__DIRNAME, '../../dist');

export default function routes(app: Express) {
    app.use('/assets', (req, res) => {
        res.sendFile(path.resolve(UIBuildPath, `assets/${req.url}`));
    });
    app.use(['/favicon.svg', '/favicon.png', '/favicon.ico'], (req, res) => {
        res.sendFile(path.resolve(UIBuildPath, req.url));
    });
    
    app.use(['/', '/index.html'], (_, res) => {
        res.sendFile(path.resolve(UIBuildPath, 'index.html'));
    });

    app.get('/calendar-events', calendarControllers.getCalendarEvents);
}