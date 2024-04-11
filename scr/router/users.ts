import express from "express";

import { deleteUser, getAllUsers, updateUser, follow } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

import { checkCache } from "../middlewares/caching"


/**
 * Configures user-related routes.
 * @param {express.Router} router - The router object from Express.
 */
export default (router: express.Router) => {
    // Route to get all users with caching and authentication
    router.get('/users', checkCache, isAuthenticated, getAllUsers);

    // Route to delete a user with authentication and ownership check
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);

    // Route to update a user with authentication and ownership check
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser);

    // Route to follow another user with authentication
    router.post('/follow/:id', isAuthenticated, follow);
};