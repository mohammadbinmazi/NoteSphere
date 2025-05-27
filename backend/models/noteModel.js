const { pool } = require("../config/db");

const getNotesByUserId = async (userId) => {
  const result = await pool.query("SELECT * FROM notes where user_id = $1", [
    userId,
  ]);
  return result.rows;
};
const createNoteInDb = async (userId, title, content) => {
  const result = await pool.query(
    "INSERT INTO notes (user_Id ,title,content) VALUES($1,$2,$3) RETURNING *",
    [userId, title, content]
  );
  return result.rows[0];
};
const updateNoteInDb = async (noteid, userId, title, content) => {
  const result = await pool.query(
    "UPDATE notes SET title=$1 , content=$2 where id = $3 AND user_id =$4 RETURNING *",
    [title, content, noteid, userId]
  );
  return result.rowCount > 0;
};
const deleteNote = async (noteId, userId) => {
  const result = await pool.query(
    "DELETE from notes where id=$1 AND user_id = $2",
    [noteId, userId]
  );
  return result.rowCount > 0;
};
module.exports = {
  getNotesByUserId,
  createNoteInDb,
  updateNoteInDb,
  deleteNote,
};
