import express from "express";
import http from "http";
import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import { Server as SocketIOServer } from "socket.io";

import { auth, handleConnection } from "./middlewares/notification";

import dotenv from 'dotenv';
dotenv.config();

const mongoUrl = process.env.MONGO_URL as string


const app = express()


app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieparser());
app.use(bodyparser.json());


const server = http.createServer(app);
const io = new SocketIOServer(server);

export { io };


auth(io);

handleConnection(io);

// Start the server on port 8080
server.listen(8080, () => {
    console.log("Server running on http://localhost:8080/ ");
});


// Connect to MongoDB using the provided URL
const MONGO_URL = mongoUrl


mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (error: Error) => console.log(error));


app.use('/', router());

