import express from "express"

import { login, register } from '../controllers/authentication';


/**
 * Sets up authentication routes.
 * @param {express.Router} router - The router object from Express.
 */
export default (router: express.Router) => {
    // Route for user registration
    router.post('/auth/register', register)

    // Route for user login
    router.post('/auth/login', login)
};