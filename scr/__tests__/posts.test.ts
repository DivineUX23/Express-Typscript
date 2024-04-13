import request from 'supertest';
import app from '../index';

describe("Route to get all posts", () => {

  test("Route to get all posts", async () => {
    const res = await request(app).get("/posts");
    expect(res.status).toBe(200);
  });
});


describe("Route to get a single post by ID", () => {

  test("Route to get a single post by ID", async () => {
    const res = await request(app).get("/posts/:id");
    expect(res.status).toBe(200);
  });
});


describe("Route to create a new post", () => {

  test("Route to create a new post", async () => {
    const res = await request(app).post("/posts/new");
    expect(res.status).toBe(200);
  });
});



describe("Route to delete a post", () => {

  test("Route to delete a post", async () => {
    const res = await request(app).delete("/posts/1");
    expect(res.status).toBe(200);
  });
});



describe("Route to update a post,", () => {

  test("Route to update a post,", async () => {
    const res = await request(app).patch("/posts/1");
    expect(res.status).toBe(200);
  });
});




describe("Route to get posts by a specific user", () => {

  test("Route to get posts by a specific user", async () => {
    const res = await request(app).get("/posts/user/:id");
    expect(res.status).toBe(200);
  });
});


describe("Route to get posts from followed users", () => {
  
  test("Route to get posts from followed users", async () => {
    const res = await request(app).get("/post/following");
    expect(res.status).toBe(200);
  });
});



describe("Route to comment", () => {
  
  test("Route to comment", async () => {
    const res = await request(app).post("/posts/comment/:id");
    expect(res.status).toBe(200);
  });
});

describe("Route to like a post", () => {
  
  test("Route to like a post", async () => {
    const res = await request(app).post("/posts/likes/:id");
    expect(res.status).toBe(200);
  });
});