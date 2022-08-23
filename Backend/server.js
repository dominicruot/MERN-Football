import mongoose from 'mongoose'
import dotenv from 'dotenv'
import express from 'express'
// const router = express.Router()


dotenv.config({ path: './config.env' });
// import index from './index'

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

const Server = mongoose
    .connect(DB, {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    })
    .then(() => console.log('Database connection successful!'));

export default Server;