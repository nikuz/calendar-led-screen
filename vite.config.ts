import path from 'path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solid()],
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
            '@calendar': path.resolve(__dirname, 'src/pages/calendar'),
            '@game': path.resolve(__dirname, 'src/pages/game'),
        },
    },
});
