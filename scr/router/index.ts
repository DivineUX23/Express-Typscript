import express from "express";

import authentication from "./authentication"
import users from "./users";
import posts from "./posts"

const router = express.Router();

/**
 * Initializes all route configurations.
 * @returns {express.Router} - The configured router.
 */
export default (): express.Router => {
    // Apply authentication routes to the router
    authentication(router);

    // Apply user-related routes to the router
    users(router);

    // Apply post-related routes to the router
    posts(router);

    return router;
};