const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Register / Add User
 * - Validates input
 * - Ensures username uniqueness
 * - Hashes password with bcrypt
 * - Saves user to DB
 */
async function addUser(req, res) {
  try {
    const { username, password } = req.body;

    // validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // uniqueness check
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create & save
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("addUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Login User
 * - Validates input
 * - Verifies user exists
 * - Compares password with bcrypt.compare
 * - Generates JWT
 * - Sets HttpOnly cookie and returns token in JSON (for localStorage)
 */
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    // sign token (payload: minimal)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // change as needed
    );

    // cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production (requires HTTPS)
      sameSite: "lax", // keep 'lax' for dev. For cross-site cookies in production use 'none' + secure:true
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    // set cookie
    res.cookie("token", token, cookieOptions);

    // respond with token (for localStorage) and minimal user info
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addUser,
  loginUser,
};
