const express = require("express");
const router = express.Router();

const { addUser, loginUser } = require("../controller/user");
const authMiddleware = require("../middleware/authMiddleware");

// Public
router.post("/register", addUser);
router.post("/login", loginUser);

// Protected example — returns decoded token payload (user info)
router.get("/me", authMiddleware, (req, res) => {
  // req.user is set by authMiddleware
  res.status(200).json({
    message: "Authenticated",
    user: req.user,
  });
});

module.exports = router;
