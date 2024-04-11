import express from "express";

import { getUser, deleteUserById, getUserById, UserModel } from "../db/users";
import { getUserBySessionToken } from "../db/users";
import paginationMiddleware from '../middlewares/pagination';

import { Redis } from "ioredis";


import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL as string

const redis = new Redis(redisUrl);



/**
 * Retrieves all users with pagination.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getAllUsers = async (req: express.Request, res: express.Response) => {

    try{
        // Apply pagination middleware to the user retrieval
        const { data: users, pagination } = await paginationMiddleware(
            req,
            UserModel,
            getUser()
            );

        // Cache the retrieved users and pagination details
        const cacheKey = `cachedData:${JSON.stringify(req.query)}`;
        await redis.set(cacheKey, JSON.stringify({ users, pagination }), 'EX', 3600); 
        
        
        return res.status(200).json({ users: users, pagination });

    } catch (error){
        console.log(error);
        return res.status(500).send('An error occurred while retrieving users.');
    }
};


/**
 * Deletes a user by their ID.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deleteUser = await deleteUserById(id);

        return res.status(200).json(deleteUser);

    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while deleting the user.');
    }
};


/**
 * Updates a user's username by their ID.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const updateUser = async (req: express.Request, res: express.Response) => {

    try{

        const { id } = req.params;
        const { username } = req.body;

        // Validate the presence of the username
        if (!username) {
            return res.status(400).send('Username is required.');
        }

        const user = await getUserById(id);

        // Update the username
        user.username = username;
        await user.save();

        return res.status(200).json(user).end()

    } catch (error){
        console.log(error);
        return res.status(500).send('An error occurred while updating the user.');
    }

}



/**
 * Handles the following of another user.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const follow = async (req: express.Request, res: express.Response) => {
    try{
        const { id }  = req.params;
        const userToFollow = await getUserById(id);

        // Validate the existence of the user to follow
        if (!userToFollow) {
            return res.status(404).send('User to follow not found.');
        }
    
        const sessionToken = req.cookies['DEMO-AUTH'];

        // Authenticate the current user via session token
        if (!sessionToken) {
            return res.status(403).send('Authentication required.');
        }
        const currentUser  = await getUserBySessionToken(sessionToken);
        if(!currentUser ){
            return res.status(403).send('Current user not found.');
        }

        // Prevent users from following themselves
        if (currentUser._id.toString() === id) {
            return res.status(400).send('Cannot follow yourself.');
        }

        // Prevent users from following the same user multiple times
        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).send('Already following this user.');
        }

        // Add the follow relationship
        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser .save();
        await userToFollow.save();

        return res.status(200).send('Followed successfully')

    }catch(error){
        console.log(error);
        return res.status(500).send('An error occurred while following the user.');
    }
}