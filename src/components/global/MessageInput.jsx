// components/MessageInput.jsx
import { useState } from "react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div style={{ display: "flex", padding: "10px", background: "white" }}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          background: "dodgerblue",
          color: "white",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
