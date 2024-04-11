import express from 'express';
import request from 'supertest';
import { PostModel } from '../db/post';
import * as postController from '../controllers/posts';
import { getUserBySessionToken } from '../db/users';
import { getUserNotification, NotificationModel } from '../db/notifications';
import { getUserById } from '../db/users';

jest.mock('../db/post', () => ({
  getPosts: jest.fn(),
  createPost: jest.fn(),
  getPostById: jest.fn(),
  deletePostById: jest.fn(),
  getPostsByUser: jest.fn(),
}));

jest.mock('../db/users', () => ({
  getUserBySessionToken: jest.fn(),
  getUserById: jest.fn(),
}));

jest.mock('../db/notifications', () => ({
  getUserNotification: jest.fn(),
  NotificationModel: jest.fn(),
}));

jest.mock('../middlewares/pagination', () => jest.fn());
jest.mock('../middlewares/notification', () => ({
  handleConnection: jest.fn(),
  connectedSockets: jest.fn(),
}));

jest.mock('./gemini', () => ({
  run: jest.fn(),
}));

describe('Post Controller', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.get('/posts', postController.getAllPost);
    app.get('/posts/:id', postController.getOneById);
    app.post('/posts', postController.creatingPost);
    app.delete('/posts/:id', postController.deletePost);
    app.put('/posts/:id', postController.updatePost);
    app.get('/posts/user/:id', postController.getPostByUser);
    app.get('/posts/following', postController.getPostByFollowing);
    app.post('/posts/:id/comment', postController.comment);
    app.post('/posts/:id/like', postController.likes);
    app.post('/mentions', postController.mentions);
  });


  describe('getAllPost', () => {
    it('should return posts and pagination data', async () => {
      const mockPosts = [{ _id: '1', post: 'post1' }, { _id: '2', post: 'post2' }];
      const mockPagination = { page: 1, limit: 10, totalPages: 2 };
      const mockPaginationMiddleware = jest.fn().mockResolvedValue({ data: mockPosts, pagination: mockPagination });
      jest.mock('../middlewares/pagination', () => mockPaginationMiddleware);

      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ posts: mockPosts, pagination: mockPagination });
      expect(mockPaginationMiddleware).toHaveBeenCalledWith(expect.any(Object), PostModel, expect.any(Function));
    });
  });

});