const {
  getNotesByUserId,
  createNoteInDb,
  updateNoteInDb,
  deleteNote,
} = require("../models/noteModel");

const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await getNotesByUserId(userId);
    res.status(200).json(notes);
  } catch (error) {
    console.error("error fetching the notes", error.message);

    res.status(500).json({ message: "server error" });
  }
};
const createnote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "title and content is required" });
  }
  try {
    const newNote = await createNoteInDb(req.user.id, title, content);
    res.status(200).json({ message: "created successfully", newNote });
  } catch (err) {
    res.status(500).json({ message: "failed to create note" });
  }
};
const updateNote = async (req, res) => {
  const { title, content } = req.body;
  const noteId = req.params.id;
  try {
    const update = await updateNoteInDb(noteId, req.user.id, title, content);
    if (!update) {
      return res.status(404).json({ message: "note not found UnAuthorized" });
    }
    res.status(200).json({ message: "note updated" });
  } catch (error) {
    console.error("error while updating", error.message);

    res.status(501).json({ message: "its not update" });
  }
};
const deleteNotes = async (req, res) => {
  const noteId = req.params.id;
  try {
    const deleted = await deleteNote(noteId, req.user.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "note is not delete or unauthorized" });
    }
    res.status(200).json({ message: "note is deleted" });
  } catch (error) {
    console.error("error while deleting", error.message);

    res.status(500).json({ message: "failed to delete" });
  }
};
module.exports = {
  getAllNotes,
  createnote,
  updateNote,
  deleteNotes,
};
