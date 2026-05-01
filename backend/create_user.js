import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function createUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.create({
            name: 'Amruta Patil',
            email: 'amrutapatil3021@gmail.com',
            password: 'password123' // Temporary password
        });
        console.log('Successfully created user:');
        console.log(JSON.stringify(user, null, 2));
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

createUser();
