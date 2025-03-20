import express, { Request, Response } from 'express';
import { ENV_VARS } from './configs/config';
import authRouter from './routes/authRoutes'
import { connectDB } from './databases/db';
import bookRouter from './routes/bookRoutes';
import cors from 'cors';
import { cronJob } from './utils/cron';

const app = express();
cronJob.start();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Hi.. Kumar"
    })
})

app.use('/auth', authRouter);
app.use('/books', bookRouter);

const PORT = ENV_VARS.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    connectDB();
})