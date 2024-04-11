import express from 'express';
import request from 'supertest';
import { UserModel } from '../db/users';
import * as userController from '../controllers/users';

jest.mock('../db/users', () => ({
  getUser: jest.fn(),
  deleteUserById: jest.fn(),
  getUserById: jest.fn(),
  getUserBySessionToken: jest.fn(),
}));

jest.mock('../middlewares/pagination', () => jest.fn());

describe('User Controller', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.get('/users', userController.getAllUsers);
    app.delete('/users/:id', userController.deleteUser);
    app.put('/users/:id', userController.updateUser);
    app.put('/users/:id/follow', userController.follow);
  });

  describe('getAllUsers', () => {
    it('should return users and pagination data', async () => {
      const mockUsers = [{ _id: '1', username: 'user1' }, { _id: '2', username: 'user2' }];
      const mockPagination = { page: 1, limit: 10, totalPages: 2 };
      const mockPaginationMiddleware = jest.fn().mockResolvedValue({ data: mockUsers, pagination: mockPagination });
      jest.mock('../middlewares/pagination', () => mockPaginationMiddleware);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ users: mockUsers, pagination: mockPagination });
      expect(mockPaginationMiddleware).toHaveBeenCalledWith(expect.any(Object), UserModel, expect.any(Function));
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return the deleted user', async () => {
      const mockUser = { _id: '1', username: 'user1' };
      const deleteUserById = jest.fn().mockResolvedValue(mockUser);
      jest.mock('../db/users', () => ({ deleteUserById }));

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(deleteUserById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      const mockUser = { _id: '1', username: 'user1', save: jest.fn() };
      const getUserById = jest.fn().mockResolvedValue(mockUser);
      jest.mock('../db/users', () => ({ getUserById }));

      const response = await request(app)
        .put('/users/1')
        .send({ username: 'updatedUser' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(getUserById).toHaveBeenCalledWith('1');
      expect(mockUser.username).toBe('updatedUser');
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

});