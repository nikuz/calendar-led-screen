import express from 'express';
import cors from 'cors';
import routes from './routes.ts';

const port = process.env.PORT ?? '8080';

const app = express();
app.use(cors());
app.use(express.json());

routes(app);

app.listen(port, () => {
    console.log(`Node server started at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    process.exit(0);
});