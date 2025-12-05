// components/MessageList.jsx
function MessageList({ messages }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "10px", background: "#f7f7f7" }}>
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <strong>{msg.sender}: </strong>
          <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
