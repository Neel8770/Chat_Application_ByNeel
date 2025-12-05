import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8080/users/login",
        { username, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);

      navigate("/Home");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
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
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: { xs: 3, sm: 4 },
          width: { xs: "100%", sm: "400px" },
          maxWidth: "450px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ marginBottom: 2, fontWeight: "bold", color: "#072032" }}
        >
          Login Page
        </Typography>

        {error && (
          <Typography
            sx={{ color: "red", marginBottom: 2, fontWeight: "bold" }}
          >
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleLogin}>
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
            Login
          </Button>

          {/* Registration Button */}
          <Button
            variant="text"
            onClick={() => navigate("/register")}
            sx={{
              width: "100%",
              color: "#072032",
              marginTop: 2,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Don’t have an account? Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
