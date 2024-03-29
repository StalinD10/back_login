import express from 'express'
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js'
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload({useTempFiles: true, tempFileDir: './uploads'}));

app.use('/api', authRoutes);

export default app;