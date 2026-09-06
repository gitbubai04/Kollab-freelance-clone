// Must run before anything else: `extendZodWithOpenApi` (called inside this
// module) patches how zod builds new schemas, so any schema constructed
// before this import (e.g. a validator pulled in transitively by `./app`)
// would silently be missing `.openapi()` and crash the first time the
// OpenAPI registry tries to use it.
import './openapi/registry';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { SeedAdminUser } from './controllers/auth.controller';

dotenv.config();

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

mongoose
    .connect(mongoUri)
    .then(async () => {
        console.log('Database connected');

        await SeedAdminUser();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });