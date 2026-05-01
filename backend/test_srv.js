import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const uri = "mongodb+srv://amrutapatil3021_db_user:fKp5AlrdnYEsdP0a@ac-4iw7s7v.yiayuob.mongodb.net/gold-dashboard?retryWrites=true&w=majority";
console.log('Testing connection to guessed SRV URI...');

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('SUCCESS: Connected to MongoDB via SRV');
  await mongoose.connection.close();
  process.exit(0);
} catch (error) {
  console.error('FAILURE: Could not connect to MongoDB via SRV');
  console.error(error.message);
  process.exit(1);
}
