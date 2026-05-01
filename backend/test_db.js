import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri.split('@')[1]); // Don't log credentials

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('SUCCESS: Connected to MongoDB');
  await mongoose.connection.close();
  process.exit(0);
} catch (error) {
  console.error('FAILURE: Could not connect to MongoDB');
  console.error(error.message);
  process.exit(1);
}
