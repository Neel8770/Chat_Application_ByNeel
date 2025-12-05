const Message = require("../models/message");

// Add a new message
async function addMessage(req, res) {
  try {
    const { sender, text } = req.body;
    if (!sender || !text)
      return res.status(400).json({ message: "Sender and text are required" });

    const message = new Message({ sender, text });
    await message.save();

    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all messages
async function getAllMessages(req, res) {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { addMessage, getAllMessages };
