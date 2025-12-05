import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  Button,
  Snackbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Base backend URL
const API_BASE = "http://localhost:8080";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "anonymous";
  const token = localStorage.getItem("token") || null;

  axios.defaults.withCredentials = true;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [useSocket, setUseSocket] = useState(false);
  const socketRef = useRef(null);
  const pollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [snack, setSnack] = useState({ open: false, msg: "" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/messages/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const msgs = Array.isArray(res.data) ? res.data : res.data.messages || [];
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setSnack({ open: true, msg: "Failed to load messages" });
    }
  };

  useEffect(() => {
    let mounted = true;

    async function trySocket() {
      try {
        const mod = await import("socket.io-client");
        if (!mounted) return;
        const { io } = mod;
        const socket = io(API_BASE, {
          transports: ["websocket", "polling"],
          withCredentials: true,
          auth: token ? { token } : {},
          autoConnect: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          setUseSocket(true);
          socket.emit("join", { username });
        });

        socket.on("connect_error", (err) => {
          console.warn("Socket connect_error:", err.message || err);
          setUseSocket(false);
        });

        socket.on("receiveMessage", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });

        socket.on("message", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });

        socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          setUseSocket(false);
        });
      } catch (err) {
        console.warn("Socket.IO unavailable or failed to load:", err.message || err);
        setUseSocket(false);
      }
    }

    loadHistory();
    trySocket();

    const fallbackTimer = setTimeout(() => {
      if (!socketRef.current || !socketRef.current.connected) {
        setUseSocket(false);
        if (!pollRef.current) {
          pollRef.current = setInterval(loadHistory, 3000);
        }
      }
    }, 1500);

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;

    const msgObj = { sender: username, text };

    setMessages((prev) => [...prev, { ...msgObj, temp: true, createdAt: new Date().toISOString() }]);
    setNewMessage("");

    if (useSocket && socketRef.current && socketRef.current.connected) {
      try {
        socketRef.current.emit("sendMessage", msgObj, (ack) => {
          if (ack && ack._id) {
            setMessages((prev) => {
              const copy = prev.slice();
              const idx = copy.findIndex((m) => m.temp && m.text === text && m.sender === username);
              if (idx !== -1) copy.splice(idx, 1, ack);
              return copy;
            });
          }
        });
      } catch (err) {
        console.error("Socket send failed:", err);
      }
    } else {
      try {
        const res = await axios.post(`${API_BASE}/messages/add`, msgObj, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data && res.data.data) {
          setMessages((prev) => {
            const copy = prev.slice();
            const idx = copy.findIndex((m) => m.temp && m.text === text && m.sender === username);
            if (idx !== -1) copy.splice(idx, 1, res.data.data);
            else copy.push(res.data.data);
            return copy;
          });
        }
      } catch (err) {
        console.error("Failed to send message via REST:", err);
        setSnack({ open: true, msg: "Message failed to send" });
      }
    }
  };

  const handleLogout = () => {
    if (socketRef.current) socketRef.current.disconnect();
    if (pollRef.current) clearInterval(pollRef.current);

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f0f2f5" }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#075E54" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar>{username?.charAt(0).toUpperCase() || "U"}</Avatar>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#fff" }}>
                {username}
              </Typography>
              <Typography variant="caption" sx={{ color: "#e0e0e0" }}>
                {useSocket ? "• live" : "• polling"}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ marginRight: 2 }}>
              Logout
            </Button>
            <IconButton color="inherit">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={msg._id ?? `${index}-${msg.text}`}
              sx={{
                justifyContent: msg.sender === username ? "flex-end" : "flex-start",
                display: "flex",
                flexDirection: "column",
                alignItems: msg.sender === username ? "flex-end" : "flex-start",
                gap: 0.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {msg.sender !== username && (
                  <ListItemAvatar>
                    <Avatar>{msg.sender?.charAt(0) ?? "U"}</Avatar>
                  </ListItemAvatar>
                )}

                <Paper
                  elevation={2}
                  sx={{
                    backgroundColor: msg.sender === username ? "#dcf8c6" : "#fff",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    maxWidth: "75%",
                  }}
                >
                  <ListItemText
                    primary={msg.text}
                    secondary={msg.sender !== username ? msg.sender : ""}
                  />
                </Paper>
              </Box>
              {/* Show sender's name instead of time */}
              <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: "bold" }}>
                {msg.sender}
              </Typography>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input Bar */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "6px 10px",
          backgroundColor: "#fff",
        }}
      >
        <IconButton color="primary">
          <EmojiEmotionsOutlinedIcon />
        </IconButton>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          sx={{
            mx: 1,
            "& .MuiOutlinedInput-root": { borderRadius: "25px" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={sendMessage}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ open: false, msg: "" })}
        message={snack.msg}
      />
    </Box>
  );
}
