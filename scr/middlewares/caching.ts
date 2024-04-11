import express from "express";

import { Redis } from "ioredis";

import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL as string

const redis = new Redis(redisUrl);

/**
 * Middleware function to check if data is in cache.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
export const checkCache = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    // Creating a cache key
    const cacheKey = `cachedData:${JSON.stringify(req.query)}`;

    // Getting data from cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      res.status(200).json(JSON.parse(cachedData));
    } else {
      // call the next middleware function
      next(); 
    }
  };
  