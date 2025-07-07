import jwt from "jsonwebtoken"
import db from "../config/db.js";
export const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db("users").where({ id: decoded.id }).first();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


