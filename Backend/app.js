import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
import Server from '../Backend/server'

dotenv.config({ path: './.env' });
const app = express();

// app.use(Server)
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);


app.listen(5000, () => console.log('Server running at port 5000'));

export default app;
