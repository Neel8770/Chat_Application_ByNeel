const express = require("express");
const router = express.Router();
const { addMessage, getAllMessages } = require("../controller/message");

// Send message
router.post("/add", addMessage);

// Get all messages
router.get("/all", getAllMessages);

module.exports = router;
