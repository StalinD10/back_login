import mongoose from 'mongoose';
import { MONGO_URL } from './config.js';

export const connnectDB = async () => {
    console.log(MONGO_URL)
    try {
        await mongoose.connect(MONGO_URL);
        console.log('DB is connected');
    } catch (error) {
        console.log(error);
    }
}