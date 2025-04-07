import path from 'node:path';
import { Express } from 'express';

const UIBuildPath = path.resolve(__dirname, '../../dist');

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
}