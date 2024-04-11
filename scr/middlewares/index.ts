import express from "express";
import { get, identity, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";
import { getPostById } from "../db/post";


/**
 * Middleware to check if the current user is the owner of the resource.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {Promise<void>} next - The next middleware function.
 */
export const isOwner = async ( req: express.Request, res: express.Response, next: express.NextFunction ) => {

    try{
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        
        if (!currentUserId){
            return res.status(403).send('Access denied. No user identity found.');
        }

        if (currentUserId.toString() != id) {
            return res.status(403).send('Access denied. User is not the owner.');

        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}



/**
 * Middleware to check if the current user is the owner of the post.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {Promise<void>} next - The next middleware function.
 */
export const isPostOwner = async ( req: express.Request, res: express.Response, next: express.NextFunction ) => {

    try{
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        
        if (!currentUserId){
            return res.status(403).send('Access denied. No user identity found.');
        }

        const post = await getPostById(id);

        if (post?.user.toString() != currentUserId) {
            return res.status(403).send('Access denied. User is not the owner.');
        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}


/**
 * Middleware to authenticate the user based on session token.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {Promise<void>} next - The next middleware function.
 */
export const isAuthenticated = async ( req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['DEMO-AUTH'];

        if (!sessionToken) {
            return res.status(403).send('Access denied. No session token provided.');
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.status(403).send('Access denied. Invalid session token.');
        }

         // Merge the existing user into the request object
        merge(req, { identity: existingUser })

        return next();

    }catch(error){
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
}