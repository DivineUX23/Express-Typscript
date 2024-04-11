import express from "express"

import { getAllPost, getOneById, creatingPost, deletePost, updatePost, 
    getPostByUser, getPostByFollowing, comment, likes, mentions } from "../controllers/posts"

import { isAuthenticated, isOwner, isPostOwner } from "../middlewares";

import { checkCache } from "../middlewares/caching"

import { upload } from "../middlewares/uploads";


// Configure multer to handle multiple file fields
const uploadPost = upload.fields([{ name: 'image' }, { name: 'video' }])


/**
 * Configures routes for the post-related endpoints.
 * @param {express.Router} router - The router object from Express.
 */
export default (router: express.Router) => {

    // Route to get all posts, with caching and authentication
    router.get('/posts', checkCache, isAuthenticated, getAllPost);

    // Route to get a single post by ID, with caching and authentication
    router.get('/posts/:id', checkCache, isAuthenticated, getOneById);

    // Route to create a new post, with file upload and authentication
    router.post('/posts/new', uploadPost, isAuthenticated, creatingPost);

    // Route to delete a post, with authentication and ownership check
    router.delete('/posts/:id', isAuthenticated, isPostOwner, deletePost);

    // Route to update a post, with file upload, authentication, and ownership check
    router.patch('/posts/:id', uploadPost, isAuthenticated, isPostOwner, updatePost);

    // Route to get posts by a specific user, with caching and authentication
    router.get('/posts/user/:id', checkCache, isAuthenticated, getPostByUser);

    // Route to get posts from followed users, with caching and authentication
    router.get('/post/following', checkCache, isAuthenticated, getPostByFollowing);

    // Route to comment on a post, with authentication
    router.post('/posts/comment/:id', isAuthenticated, comment);

    // Route to like a post, with authentication
    router.post('/posts/likes/:id', isAuthenticated, likes);

    // Route to mention users in a post, with authentication
    router.post('/posts/mentions', isAuthenticated, mentions);

};