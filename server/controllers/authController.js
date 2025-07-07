import db from "../config/db.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  
  const { email, password } = req.body;
  try {
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: "Email or password incorrect!" });
    }
    
    const isMatch = await bcrypt.compare(password,user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password incorrect!" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        full_name:user.full_name,
        email: user.email,
        role:"user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong with the server." });
  }
};

