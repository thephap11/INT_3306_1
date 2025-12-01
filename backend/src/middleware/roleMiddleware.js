
export function requireRole(...roles) {
  return (req, res, next) => {
    console.log("🔐 Role check - User:", req.user?.username, "Role:", req.user?.role, "Required:", roles); // Debug log
    if (!req.user || !roles.includes(req.user.role)) {
      console.log("❌ Access denied - user role:", req.user?.role); // Debug log
      return res.status(403).json({message: "Forbidden"});
    }
    console.log("✅ Access granted"); // Debug log
    next();
  };
}
