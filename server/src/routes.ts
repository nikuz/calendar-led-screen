import path from 'node:path';
import fs from 'node:fs';
import type { Express } from 'express';
import type { Server } from 'socket.io';
import {
    calendarControllers,
    BrightnessSensorReader,
} from './controllers/index.ts';
import { __DIRNAME } from './constants.ts';

const UIBuildPath = path.resolve(__DIRNAME, '../../dist');

export default function routes(app: Express, io: Server) {
    app.use([
        '/assets',
        '/favicon.*any',
        '/fonts/*name',
        '/sounds/*name',
        '/icons/*name',
        '/images/*name',
    ], (req, res) => {
        const assetPath = path.join(UIBuildPath, req.originalUrl);
        if (!fs.existsSync(assetPath)) {
            res.status(404).send();
        } else {
            res.sendFile(path.join(UIBuildPath, req.originalUrl));
        }
    });

    app.use(['/', '/index.html'], (_, res) => {
        res.sendFile(path.resolve(UIBuildPath, 'index.html'));
    });

    app.get('/calendar-events', calendarControllers.getCalendarEvents);

    io.on('connection', (socket) => {
        console.log('websocket user connected');

        const reader = new BrightnessSensorReader(socket);

        socket.on('disconnect', () => {
            console.log('websocket user disconnected');
            reader.cleanup();
        });
    });
}