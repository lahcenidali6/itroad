import db from "../config/db.js";
import cloudinary from "cloudinary";
import {
  updateUser,
  register,
  userDocuments,
  deleteDocument,
  addDocument,
} from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const userInfo = async (req, res) => {
  const user = await db("users")
    .select(
      "id",
      "full_name",
      "email",
      "phone",
      "location",
      "avatar_url",
      "joined_at"
    )
    .where({ id: req.user.id })
    .first();
  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }
  res.json(user);
};

export const userRegisterController = async (req, res) => {
  try {
    const isStrongPassword = (password) =>
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const { password, email, full_name, phone, location } = req.body;

    if (!password || !email || !full_name || !phone || !location) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters long and contain at least one letter and one number.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email!" });
    }

    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use!" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const joined_at = new Date().toISOString();

    const newUserData = {
      email,
      full_name,
      phone,
      location,
      password_hash,
      joined_at,
    };

    const newUser = await register(newUserData);

    const token = jwt.sign(
      {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error while registering" });
  }
};

export const userUpdateController = async (req, res) => {
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  try {
    const { email, full_name, phone, location, avatar_url } = req.body;

    if (
      full_name &&
      (typeof full_name !== "string" ||
        full_name.trim().length < 2 ||
        full_name.length > 50)
    ) {
      return res
        .status(400)
        .json({ error: "Full name must be between 2 and 50 characters." });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email!" });
    }

    const user = await db("users").where({ id: req.user.id }).first();
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    const updateData = {
      email: email || user.email,
      full_name: full_name || user.full_name,
      phone: phone || user.phone,
      location: location || user.location,
      avatar_url: avatar_url || user.avatar_url,
    };

    const newDataOfUser = await updateUser(user.id, updateData);

    return res
      .status(200)
      .json({ message: "Updated successfully", data: newDataOfUser });
  } catch (err) {
    return res.status(500).json({ error: "Server error while updating " });
  }
};

export const userDocumentsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db("users").where({ id: userId }).first();
    if (!user) return res.status(400).json({ error: "user not found" });
    const documents = await userDocuments(userId);

    return res.status(200).json(documents);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "somthing happen when fetch document!" });
  }
};
export const deleteDocumentController = async (req, res) => {
  try {
    const documentId = req.params.documentId;
    const userId = req.user.id;
    const user = await db("users").where({ id: userId }).first();

    if (!user) return res.status(400).json({ error: "user not found" });

    const document = await db("documents")
      .where({ id: documentId, user_id: userId })
      .first();

    if (!document) {
      return res
        .status(404)
        .json({ error: "Document not found or not owned by user" });
    }
    await cloudinary.uploader.destroy(document.file_id, {
      resource_type: "raw",
    });
    await deleteDocument(documentId, userId);
    return res.status(200).json({ message: "document has been deleted" });
  } catch (err) {
    return res.status(500).json({ error: "somthings went happen!" });
  }
};

export const addDocumentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, status, file_url, file_id } = req.body;

    if (!name || !status || !file_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const documentData = {
      user_id: userId,
      name,
      status,
      last_updated: new Date(),
      file_url,
      file_id,
    };

    const newDocument = await addDocument(documentData);

    return res
      .status(201)
      .json({ message: "Document added successfully", document: newDocument });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Something went wrong while adding the document" });
  }
};
export const userUpdateAvatarController = async (req, res) => {
  try {
    
    const userId = req.user.id;
    const avatarUrl = req.body.avatar_url;
    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await db("users").where({ id: userId }).update({
      avatar_url: avatarUrl,
    });
    res.status(200).json({ message: "avatar has been added" });
  } catch (err) {
    res.status(500).json({ error: "somthing went happen when adding avatar" });
  }
};
