import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("http://localhost:8080/users/register", {
        username,
        password,
      });

      setMessage(res.data.message);
      setUsername("");
      setPassword("");

      // Auto redirect to login after 1 sec
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0B1B2F",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: 4,
          width: "400px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ marginBottom: 2, fontWeight: "bold", color: "#072032" }}
        >
          New User?
        </Typography>

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": { borderRadius: "25px" },
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": { borderRadius: "25px" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              width: "100%",
              backgroundColor: "#6BE3AA",
              color: "#072032",
              borderRadius: "30px",
              fontWeight: "bold",
              paddingY: 1.2,
              "&:hover": { backgroundColor: "#4dd197" },
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          {/* Navigate back to Login */}
          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{
              width: "100%",
              marginTop: 2,
              color: "#072032",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Already have an account? Login
          </Button>
        </Box>

        {message && (
          <Typography
            sx={{
              marginTop: 2,
              color: message.includes("success") ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Registration;
