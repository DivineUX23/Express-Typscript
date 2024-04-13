import express from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from "socket.io";
import { getUserBySessionToken } from '../db/users';

import { getUserById } from  "../db/users";
import { NotificationModel, getUserNotification } from '../db/notifications'


const app = express();
const server = http.createServer(app);
//export const ios = new SocketIOServer(server);

import { io } from "../index"


// Define interfaces for socket data and map
export interface SocketData {
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
      const token = socket.handshake.headers.authorization
      console.log(`toekn is ${token}`)
      const userId = await getUserBySessionToken(token as string);
      console.log(userId)
      const user = userId._id.toString();
      console.log(user)
      //const user = "66150c7b2a17cbcd26d74d2b";

      if (!user) {
        return next(new Error('Authentication error'));
      }

      // Store the connected socket and user information
      connectedSockets[socket.id] = { user, socket };
      
      next();
    } catch (error) {
      console.log(error)
      next(error);
    }
  });
};



/**
 * Handles new socket connections.
 * @param {SocketIOServer} io - The Socket.IO server instance.
 */
export const handleConnection = async (io: SocketIOServer) => {

  // Retrieve the user associated with the connected socket
  io.on('connection', (socket: Socket) => {

    const { user } = connectedSockets[socket.id];

    console.log(user)

    // Join the user to a private room
    socket.join(`user:${user}`);

    socket.on('notification', (data) => {
      console.log('Received notification:', data);

    });

    // Handle disconnection and remove the socket from the connected sockets map
    socket.on('disconnect', () => {
      delete connectedSockets[socket.id];
    });
  });
};








/**
 * Handles sending notification to mentioned user.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {any} userId - user ID
 * @param {String} userId - post ID
 */
export const mentions = async (req: express.Request, res: express.Response, userId: any, post: String ) => {

  console.log(`-------------${userId}`)

  try{

      // Retrieve the author of the post
      const postAuthor = await getUserById(userId);
      if (!postAuthor) {
          return res.status(404).send('Post author not found.');
      }

      // Check for existing notifications
      const existingNotifications = await NotificationModel.findOne({ user: postAuthor._id.toString() });

      // Create a new notification if none exist
      if (!existingNotifications) {

          const Notification = new NotificationModel({
              user: postAuthor._id,
              notifications: [
                  {
                      type: 'mention',
                      data: post
                  },
              ],
          });
          await Notification.save();
          

          io.to(`user:${postAuthor._id.toString()}`).emit('notification', Notification);
          console.log('New mention notification sent');

      } else {
          // Add to existing notifications
          const Notification = {
              type: 'mention',
              data: post
          };

          existingNotifications.notifications.push(Notification);
          await existingNotifications?.save();

          
          // Emit the 'mention' event to the post author
          io.to(`user:${postAuthor._id.toString()}`).emit('notification', Notification);
          console.log('New mention notification sent');

      }

  } catch (error) {
      console.log(error);
      return res.status(500).send('An error occurred while creating the mention notification.');
  }
};







/**
 * Handles sending notification to creator of liked post.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {any} post - post object
 * @param {String} existingUser - post creator ID
 */
export const like_notification = async (req: express.Request, res: express.Response, post: any , existingUser: any ) => {

  console.log(`-------------${post}`)

  try{

      // Retrieve the author of the post
      const postAuthor = await getUserById(post.user.toString());

      const existingNotifications = await getUserNotification(postAuthor._id.toString());
      

      // Create a new notification if none exist
      if (!existingNotifications) {

          const Notification = new NotificationModel({
          user: postAuthor?._id,
          notifications: [
              {
              type: 'like',
              data: {
                  postId: post?._id,
                  likedBy: existingUser._id,
              },
              },
          ],
          });
          await Notification.save();

          // Emit the notification event to the post author            
          io.to(`user:${postAuthor?._id.toString()}`).emit('notification', Notification);
          console.log('New like notification sent');
      
      } else {
      
          // Add to existing notifications
          const Notification = {
              type: 'like',
              data: {
                  postId: post?._id,
                  likedBy: existingUser._id,
              },
          };

          existingNotifications.notifications.push(Notification);
          await existingNotifications?.save();

          // Emit the notification event to the post author
          io.to(`user:${postAuthor?._id.toString()}`).emit('notification', Notification);
          console.log('New like notification sent');
      
      }


  } catch (error) {
      console.log(error);
      return res.status(500).send('An error occurred while creating the mention notification.');
  }
};




/**
/**
 * Handles sending notification to creator of commented post.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {any} post - post object
 * @param {String} existingUser - post creator ID
 */
export const comment_notification = async (req: express.Request, res: express.Response, post: any , existingUser: any, comment: String ) => {

  console.log(`-------------${post}`)

  try{
 
    
      // Retrieve the author of the post
      const postAuthor = await getUserById(post.user.toString());

      const existingNotifications = await getUserNotification(postAuthor._id.toString());


      // Create a new notification if none exist
      if (!existingNotifications) {

          const commentNotification = new NotificationModel({
          user: postAuthor._id,
          notifications: [
              {
              type: 'commenting',
              data: {
                  comment,
                  postId: post?._id,
                  commentedBy: existingUser._id,
              },
              },
          ],
          });
          await commentNotification.save();


          // Emit the notification event to the post author
          io.to(`user:${postAuthor._id.toString()}`).emit('notification', commentNotification);
          console.log('New like notification sent');

      } else {

          // Add to existing notifications
          const commentNotification = {
          type: 'commenting',
          data: {
              comment,
              postId: post?._id,
              commentedBy: existingUser._id,
          },
          };

          existingNotifications.notifications.push(commentNotification);

          await existingNotifications?.save();
          

          // Emit the notification event to the post author
          io.to(`user:${postAuthor._id.toString()}`).emit('notification', commentNotification);
          console.log('New like notification sent');
      }




  } catch (error) {
      console.log(error);
      return res.status(500).send('An error occurred while creating the mention notification.');
  }
};