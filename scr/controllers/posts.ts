import express from "express";

import { getPosts, createPost, getPostById, deletePostById, getPostsByUser, PostModel } from "../db/post";
import { getUserBySessionToken } from "../db/users";

import paginationMiddleware from '../middlewares/pagination';
import { getUserById } from  "../db/users";

import { NotificationModel, getUserNotification } from '../db/notifications'

import { io } from "../index"

import { Redis } from "ioredis";

import { run } from "./gemini"


import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL as string

const redis = new Redis(redisUrl);


/**
 * Retrieves all posts with pagination.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getAllPost = async (req: express.Request, res: express.Response) => {
    try{

        // Apply pagination middleware to the post retrieval
        const { data: posts, pagination } = await paginationMiddleware(
            req,
            PostModel,
            getPosts()
            );


        // Cache the retrieved posts and pagination details    
        const cacheKey = `cachedData:${JSON.stringify(req.query)}`;
        await redis.set(cacheKey, JSON.stringify({ posts, pagination }), 'EX', 1600); 
        

        // Return the posts and pagination details
        return res.status(200).json({ posts: posts, pagination });

    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while retrieving posts.');
    }
};



/**
 * Retrieves a single post by its ID.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getOneById = async (req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        const onepost = await getPostById(id);

        // Cache the retrieved post
        const cacheKey = `cachedData:${JSON.stringify(req.query)}`;
        await redis.set(cacheKey, JSON.stringify({ onepost }), 'EX', 3600); 
        
        // Return the retrieved post
        return res.status(200).json(onepost)

    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while retrieving the post.');
    }
};


/**
 * Handles the creation of a new post, with optional rewrite with Google Gemini Ai.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const creatingPost = async (req: express.Request, res: express.Response) => {
    try{
        const { post, edit } = req.body


        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const image = files.image ? files.image[0].path : '';
        const video = files.video ? files.video[0].path : '';
        console.log(image)


        // Validate the presence of the post content
        if ( !post ) {
            return res.status(400).send('Post content is required.');
        }

        // Authenticate the user via session token
        const sessionToken = req.cookies['DEMO-AUTH'];

        if (!sessionToken) {
            return res.status(403).send('Authentication required.');
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            res.status(403).send('User not found.');
        }

        const userIdAsString = existingUser._id.toString();


        // Create the new post with Gemini AI
        if (edit) {
            
            const newPost = await run (post, edit);
                
            const posting = await createPost({
                user: userIdAsString,
                post: newPost,
                imageUrl: image,
                videoUrl: video,
            })

            return res.status(200).json(posting).end();

        }


        // Create the new post without Gemini AI
        const posting = await createPost({
            user: userIdAsString,
            post,
            imageUrl: image,
            videoUrl: video,
        })

        return res.status(200).json(posting).end();

    } catch (error) {
        console.log(error);
        res.status(500).send('An error occurred while creating the post.');
    }
;}




/**
 * Deletes a post by its ID.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const deletePost = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletePost = await deletePostById(id);

        if (!deletePost) {
            return res.status(404).send('Post not found.');
        }

        return res.status(200).json(deletePost);
    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while deleting the post.');
    }
};




/**
 * Updates a post by its ID with optional content and/or media update.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const updatePost = async (req: express.Request, res: express.Response) => {

    try{

        const { id } = req.params;
        const { post } = req.body;
        console.log(post)


        const updatePost = await getPostById(id);

        
        if (!updatePost) {
            return res.status(404).send('Post not found.');
        }

        // Update post content if provided
        if (req.body.post) {

            if (!post) {
                return res.status(400).send('Post content is required.');
            }
            updatePost.post = post;
        }


        // Update media URLs if files are provided
        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (files.image) {
                const image = files.image ? files.image[0].path : '';
                updatePost.imageUrl = image;

            }
            if (files.video) {
                const video = files.video ? files.video[0].path : '';
                updatePost.videoUrl = video;
            }
        }
    
        // Save the updated post
        await updatePost?.save();

        return res.status(200).json(updatePost).end()

    }catch(error){
        console.log(error);
        return res.status(500).send('An error occurred while updating the post.');
    }

};



/**
 * Retrieves posts by a specific user with pagination.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getPostByUser = async (req: express.Request, res: express.Response ) => {
    try{
        const { id } = req.params;
        
        const { data: userPost, pagination } = await paginationMiddleware(
            req,
            PostModel,
            getPostsByUser(id)
            );
        
        // Cache the retrieved posts and pagination details
        const cacheKey = `cachedData:${JSON.stringify(req.query)}`;
        await redis.set(cacheKey, JSON.stringify({ userPost, pagination }), 'EX', 3600); 
        
        
        return res.status(200).json({ posts: userPost, pagination });

    }catch(error){
        console.log(error);
        return res.status(500).send('An error occurred while retrieving posts.');
    }
};



/**
 * Retrieves posts from users that the current user is following, with pagination.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getPostByFollowing = async (req: express.Request, res: express.Response ) => {
    try{

        const sessionToken = req.cookies['DEMO-AUTH'];

        // Authenticate the user via session token
        if (!sessionToken) {
            return res.status(403).send('Authentication required.');
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.status(403).send('User not found.');
        }

        // Retrieve posts from followed users
        const query = { user: { $in: existingUser.following } };

        const { data: postsByFollowing, pagination } = await paginationMiddleware(
            req,
            PostModel,
            query
        );
        
        // Cache the retrieved posts and pagination details
        const cacheKey = `cachedData:${JSON.stringify(req.query)}`;
        await redis.set(cacheKey, JSON.stringify({ postsByFollowing, pagination }), 'EX', 1600); 
        

        return res.status(200).json({ posts: postsByFollowing, pagination });

    }catch(error){
        console.log(error);
        return res.status(500).send('An error occurred while retrieving posts.');
    }
};



/**
 * Handles the creation of a comment on a post, includes storing and sending notification to post creator.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const comment = async (req: express.Request, res: express.Response ) => {
 
    try{

        const { comment } = req.body

        const { id } = req.params
    
        const sessionToken = req.cookies['DEMO-AUTH'];


        // Authenticate the user via session token
        if (!sessionToken) {
            return res.status(403).send('Authentication required.');
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.status(403).send('User not found.');
        }


        // Retrieve the post to comment on
        const post  = await getPostById(id)

        // Add the comment to the post
        const value = {
            user: existingUser._id,
            comments: comment
        }

        post?.comments.push(value);
        await post?.save();


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
            io.to(`user:${postAuthor._id.toString()}`).emit('new-like', commentNotification);
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
            io.to(`user:${postAuthor._id.toString()}`).emit('new-comment', commentNotification);
            console.log('New like notification sent');
        }

        return res.status(200).json(post?.comments);

    }catch(error){
        console.log(error);
        return res.status(500).send('An error occurred while commenting on the post.');
    }
};



/**
 * Handles the liking of a post by a user, includes storing and sending notification to post creator.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const likes = async (req: express.Request, res: express.Response ) => {
 
    try{

        const { id } = req.params
    
        const sessionToken = req.cookies['DEMO-AUTH'];

        // Authenticate the user via session token
        if (!sessionToken) {
            return res.status(403).send('Authentication required.');
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.status(403).send('User not found.');
        }

        // Retrieve the post to be liked
        const post  = await getPostById(id);

        // Unlike post if post was previously liked by user
        if (post.likes.includes(existingUser._id)) {


            post.likes = post.likes.filter(userId => userId.toString() !== existingUser._id.toString());

            await post.save();

            return res.status(200).send(post.likes);
        }

        post.likes.push(existingUser._id);

        await post.save();


        // Retrieve the author of the post
        const postAuthor = await getUserById(post.user.toString());

        const existingNotifications = await getUserNotification(postAuthor._id.toString());
        

        // Create a new notification if none exist
        if (!existingNotifications) {

            const Notification = new NotificationModel({
            user: postAuthor._id,
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
            io.to(`user:${postAuthor._id.toString()}`).emit('new-like', Notification);
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
            io.to(`user:${postAuthor._id.toString()}`).emit('new-like', Notification);
            console.log('New like notification sent');
        
        }

        // Return the count of likes
        return res.status(200).json(post.likes);

    } catch (error){
        console.log(error);
        return res.status(500).send('An error occurred while processing the like.');
    }
};


/**
 * Handles the creation of a mention notification for a post, nofities mentioned user.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const mentions = async (req: express.Request, res: express.Response ) => {

    try{

        const { userId, post } = req.body;

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
            

            io.to(`user:${postAuthor._id.toString()}`).emit('mention', Notification);
            console.log('New like notification sent');

        } else {
            // Add to existing notifications
            const Notification = {
                type: 'mention',
                data: post
            };

            existingNotifications.notifications.push(Notification);
            await existingNotifications?.save();

            
            // Emit the 'mention' event to the post author
            io.to(`user:${postAuthor._id.toString()}`).emit('mention', Notification);
            console.log('New like notification sent');

        }
        return res.status(200).json(post);

    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while creating the mention notification.');
    }
};