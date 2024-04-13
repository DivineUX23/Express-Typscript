import request from 'supertest';
import app from '../index';

describe("User routes", () => {

  test("Get all users", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
  });
});


describe("Delete user by ID", () => {

  test("Delete user by ID", async () => {
    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(200);
  });
});


describe("Update user data by ID", () => {
  
  test("Update user by ID", async () => {
    const res = await request(app).patch("/users/1");
    expect(res.status).toBe(200);
  });
});


describe("Follow user data by ID", () => {
  
  test("Follow user by ID", async () => {
    const res = await request(app).post("/follow/1");
    expect(res.status).toBe(200);
  });
});