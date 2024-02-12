import mongoose from 'mongoose';
import { MONGO_URL } from './config.js';

export const connnectDB = async () => {
    
    try {
        await mongoose.connect('mongodb+srv://stalin:0983837084david@cluster0.jhcu6ds.mongodb.net/?retryWrites=true&w=majority');
        console.log('DB is connected');
    } catch (error) {
        console.log(error);
    }
}