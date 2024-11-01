import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const PORT = process.env.API_PORT || 8000;

const app = express();

// Add CORS middleware
app.use(
    cors({
        origin: 'http://localhost:5173', // Your frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    })
);

app.get('/ping', (req: Request, res: Response) => {
    res.json({ message: 'pong' });
});

app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
