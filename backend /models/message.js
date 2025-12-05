const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
module.exports = mongoose.models.Message || mongoose.model("Message", messageSchema);
