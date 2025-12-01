
import jwt from "jsonwebtoken";
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({message: "Unauthorized"});
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    console.log("🔑 Auth payload:", payload); // Debug log
    req.user = payload;
    next();
  } catch (e) {
    console.log("❌ Token verification error:", e.message); // Debug log
    return res.status(401).json({message: "Invalid token"});
  }
}
