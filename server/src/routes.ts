import path from 'node:path';
import { Express } from 'express';

export default function routes(app: Express) {
    app.use('/assets', (req, res) => {
        res.sendFile(path.resolve(__dirname, `../dist/assets/${req.url}`));
    });
    app.use(['/favicon.svg', '/favicon.png', '/favicon.ico'], (req, res) => {
        res.sendFile(path.resolve(__dirname, `../dist/${req.url}`));
    });

    app.use('/', (_, res) => {
        res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    });
}