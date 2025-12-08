import jwt from "jsonwebtoken";
import { User } from "../models/user_model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        // also check Authorization header (Bearer token)
        if (!token && req.headers.authorization) {
          const authHeader = req.headers.authorization;
          if (authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // remove 'Bearer ' prefix
          }
        }

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[auth] Decoded token:', decoded);

        const user = await User.findById(decoded.id).select("-password");
        console.log('[auth] User found:', user);
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('[auth] Error:', error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
