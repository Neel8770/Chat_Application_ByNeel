// components/ChatWindow.jsx
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ messages, onSend }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </div>
  );
}

export default ChatWindow;
