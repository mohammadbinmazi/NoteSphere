const {
  registerUser,
  loginUser,
} = require("../../controllers/authControllers");
const userModel = require("../../models/userModel");
const hashUtil = require("../../utils/hashPassword");
const generateToken = require("../../utils/generateToken");

jest.mock("../../models/userModel");
jest.mock("../../utils/hashPassword");
jest.mock("../../utils/generateToken");

describe("Auth Controller - registerUser", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if fields are missing", async () => {
    req.body = { username: "test", email: "" };
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please enter all the fields",
    });
  });

  it("should return 400 if user already exists", async () => {
    req.body = {
      username: "test",
      email: "test@example.com",
      password: "123456",
    };
    userModel.findUserByEmail.mockResolvedValue({ id: 1 }); // user exists
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists",
    });
  });

  it("should register user and return 201", async () => {
    req.body = {
      username: "test",
      email: "test@example.com",
      password: "123456",
    };

    userModel.findUserByEmail.mockResolvedValue(null); // user doesn't exist
    hashUtil.hashPassword.mockResolvedValue("hashedPwd");
    userModel.createUser.mockResolvedValue({
      id: 1,
      username: "test",
      email: "test@example.com",
    });
    generateToken.mockReturnValue("fakeToken");

    await registerUser(req, res);

    expect(userModel.findUserByEmail).toHaveBeenCalledWith("test@example.com");
    expect(userModel.createUser).toHaveBeenCalledWith(
      "test",
      "test@example.com",
      "hashedPwd"
    );
    expect(generateToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      user: {
        id: 1,
        username: "test",
        email: "test@example.com",
      },
      token: "fakeToken",
    });
  });
});

describe("Auth Controller - loginUser", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return 400 if fields are missing", async () => {
    req.body = { email: "", password: "" };
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "please enter all fields",
    });
  });

  it("should return 400 if user not found", async () => {
    req.body = { email: "notfound@example.com", password: "123456" };
    userModel.findUserByEmail.mockResolvedValue(null);
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "user not found" });
  });

  it("should return 400 if password does not match", async () => {
    req.body = { email: "test@example.com", password: "wrongpass" };
    userModel.findUserByEmail.mockResolvedValue({
      id: 1,
      username: "test",
      email: "test@example.com",
      password: "hashedpass",
    });
    hashUtil.comparePassword.mockResolvedValue(false);

    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "wrong password" });
  });

  it("should login user and return 200", async () => {
    req.body = { email: "test@example.com", password: "123456" };
    userModel.findUserByEmail.mockResolvedValue({
      id: 1,
      username: "test",
      email: "test@example.com",
      password: "hashedpass",
    });
    hashUtil.comparePassword.mockResolvedValue(true);
    generateToken.mockReturnValue("fakeToken");

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "user login succesfully",
      user: {
        id: 1,
        username: "test",
        email: "test@example.com",
      },
      token: "fakeToken",
    });
  });
});
