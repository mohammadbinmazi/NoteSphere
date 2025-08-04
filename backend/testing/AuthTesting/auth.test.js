const request = require("supertest");
const express = require("express");
const authRoutes = require("../../routes/authRoutes");
const { pool } = require("../../config/db");

// mock token generator & hash utilities
jest.mock("../../utils/hashPassword", () => ({
  hashPassword: jest.fn(() => Promise.resolve("hashed123")),
  comparePassword: jest.fn((pass) => pass === "test123"),
}));
jest.mock("../../utils/generateToken", () => jest.fn(() => "fakeToken123"));

// mock DB query
jest.mock("../../config/db", () => {
  const mClient = {
    query: jest.fn(),
    connect: jest.fn(),
  };
  return {
    pool: mClient,
    connectDB: jest.fn(),
  };
});

// mock user creation
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/auth/register - success", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) // findUserByEmail = []
      .mockResolvedValueOnce({
        rows: [{ id: 1, username: "test", email: "test@example.com" }],
      }); // createUser

    const res = await request(app).post("/api/auth/register").send({
      username: "test",
      email: "test@example.com",
      password: "test123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/auth/login - user not found", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post("/api/auth/login").send({
      email: "fake@example.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("user not found");
  });

  test("POST /api/auth/login - success", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          username: "test",
          email: "test@example.com",
          password: "test123",
        },
      ],
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "test123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("test");
    expect(res.body).toHaveProperty("token");
  });
});
