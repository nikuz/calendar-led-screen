import http from 'node:http';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { __DIRNAME } from './constants.ts';

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__DIRNAME, '../../.env') });

import routes from './routes.ts';
import { Server } from 'socket.io';

const port = process.env.PORT ?? '8080';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
    }
});

app.use(cors());
app.use(express.json());

routes(app, io);

server.listen(port, () => {
    console.log(`Node server started at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    process.exit(0);
});