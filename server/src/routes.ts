import path from 'node:path';
import fs from 'node:fs';
import type { Express } from 'express';
import type { Server } from 'socket.io';
import {
    calendarControllers,
    BrightnessSensorReader,
    gameControllers,
} from './controllers/index.ts';
import { __DIRNAME } from './constants.ts';

const UIBuildPath = path.resolve(__DIRNAME, '../../dist');

export default function routes(app: Express, io: Server) {
    app.use([
        '/assets',
        '/static',
        '/favicon.*any',
        '/fonts/*name',
        '/sounds/*name',
        '/icons/*name',
        '/images/*name',
        '/vipasana/*name',
    ], (req, res) => {
        const assetPath = path.join(UIBuildPath, req.originalUrl);
        if (!fs.existsSync(assetPath)) {
            res.status(404).send();
        } else {
            res.sendFile(path.join(UIBuildPath, req.originalUrl));
        }
    });

    app.get('/calendar/events', calendarControllers.getCalendarEvents);

    app.get('/game/typing-sample', gameControllers.getTypingSample);

    app.use(['/', '/game', '/vipasana', '/index.html'], (_, res) => {
        res.sendFile(path.resolve(UIBuildPath, 'index.html'));
    });

    io.on('connection', (socket) => {
        console.log('websocket user connected');

        const reader = new BrightnessSensorReader(socket);

        socket.on('disconnect', () => {
            console.log('websocket user disconnected');
            reader.cleanup();
        });
    });
}