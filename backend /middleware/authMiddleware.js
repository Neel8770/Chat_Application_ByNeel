const jwt = require("jsonwebtoken");

/**
 * authMiddleware
 * - Checks for token in cookie "token" OR Authorization header "Bearer <token>"
 * - Verifies token using process.env.JWT_SECRET
 * - Attaches decoded payload to req.user
 * - Returns 401 if missing/invalid
 */
module.exports = function authMiddleware(req, res, next) {
  try {
    // 1) Try cookie first
    let token = req.cookies?.token;

    // 2) Fallback: Authorization header "Bearer <token>"
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    // 3) Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach useful info
    req.user = decoded; // e.g. { id: "...", username: "..." }
    next();
  } catch (err) {
    console.error("authMiddleware error:", err.message || err);
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};
