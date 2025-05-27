const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getAllNotes,
  createnote,
  updateNote,
  deleteNotes,
} = require("../controllers/noteControllers");

router.get("/", protect, getAllNotes);
router.post("/", protect, createnote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNotes);

module.exports = router;
