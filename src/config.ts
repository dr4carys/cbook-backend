import { config } from 'dotenv';

config();

export const MONGODB_URL = process.env.MONGODB_URI;
export const MONGO_DEBUG = true;
export const JWT_SIGNATURE = process.env.JWT_SIGNATURE;