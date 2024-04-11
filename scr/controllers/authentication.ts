import express from "express";

import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers/index';


/**
 * Handle user login with email and password.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body


        // Validate request body for required fields
        if (!email || !password){
            return res.status(400).send('Email and password are required.');
        }

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

        if(!user){
            return res.status(400).send('User not found.');
        }


        // Compare provided password with stored hash
        const expectedHash = authentication(user.authentication?.salt, password);

        if (user.authentication?.password != expectedHash) {
            return res.status(403).send('Authentication failed.');
        }
        

        // Generate a new session token
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();


        // Set authentication cookie
        res.cookie('DEMO-AUTH', user.authentication?.sessionToken, { domain: 'localhost', path: '/' })

        return res.status(200).json(user).end();

    } catch(error){
        console.log(error);
        return res.status(500).send('An error occurred during login.');
    }
}




/**
 * Handle new user registration.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>}
 */

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body


        // Validate request body for required fields
        if (!email || !password || !username) {
            return res.status(400).send('Email, password, and username are required.');
        }


        // Check if user already exists
        const existingUser = await getUserByEmail(email);

        if (existingUser){
            return res.status(409).send('User already exists.');
        }


        // Create new user with hashed password
        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            }
        })

        return res.status(200).json(user).end();

    } catch (error) {
        console.log('Registration error:', error);
        return res.status(500).send('An error occurred during registration.');
    }
}