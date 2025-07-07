import { compareSync } from "bcrypt";
import db from "../config/db.js";

const updateUser = async (id, updateData) => {
  return await db("users")
  .where({ id })
  .update(updateData)
  .returning(["id", "full_name", "email", "phone", "location", "avatar_url", "joined_at"]);
};
const register = async (newUserData) => {
 const [newUser] = await db("users")
    .insert(newUserData)
    .returning(["id", "full_name", "email"]);
  return newUser;
};
const userDocuments=async(userId)=>{
  return await db("documents").where({user_id:userId})
}
const deleteDocument = async (documentId, userId) => {
  await db("documents")
    .del()
    .where({ id: documentId, user_id: userId });
};

const addDocument = async (documentData) => {
  const { user_id, name, status, last_updated, file_url,file_id } = documentData;


  const [insertedDocument] = await db("documents")
    .insert({
      user_id,
      name,
      status,
      last_updated,
      file_url,
      file_id
    })
    .returning("*");

  return insertedDocument;
};

export { updateUser, register ,userDocuments ,deleteDocument,addDocument };
