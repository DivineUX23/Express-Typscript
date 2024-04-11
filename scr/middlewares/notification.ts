import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from "socket.io";
import { getUserBySessionToken } from '../db/users';

const app = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server);


// Define interfaces for socket data and map
interface SocketData {
  user: string;
  socket: Socket;
}

interface SocketMap {
  [key: string]: SocketData;
}

// Store connected sockets
export let connectedSockets: SocketMap = {};


/**
 * Middleware to authenticate socket connections.
 * @param {SocketIOServer} io - The Socket.IO server instance.
 */
export const auth = async (io: SocketIOServer) => {
  io.use(async (socket: Socket, next: (err?: any) => void) => {
    try {

      // Retrieve token from socket handshake to get user ID from session token
      const token = socket.handshake.auth.token;
      const userId = await getUserBySessionToken(token);
      const user = userId._id.toString();
      //const user = "66150c7b2a17cbcd26d74d2b";

      if (!user) {
        return next(new Error('Authentication error'));
      }

      // Store the connected socket and user information
      connectedSockets[socket.id] = { user, socket };
      
      next();
    } catch (error) {
      next(error);
    }
  });
};



/**
 * Handles new socket connections.
 * @param {SocketIOServer} io - The Socket.IO server instance.
 * @param {any} data - Data to be emitted to connected users.
 */
export const handleConnection = async (io: SocketIOServer, data: any) => {

  // Retrieve the user associated with the connected socket
  io.on('connection', (socket: Socket) => {

    const { user } = connectedSockets[socket.id];

    // Join the user to a private room
    socket.join(`user:${user}`);

    // Emit data to the user's private room
    io.to(`user:${user}`).emit("good", data);

    // Handle disconnection and remove the socket from the connected sockets map
    socket.on('disconnect', () => {
      delete connectedSockets[socket.id];
    });
  });
};