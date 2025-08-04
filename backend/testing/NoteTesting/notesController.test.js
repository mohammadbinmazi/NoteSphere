const {
  getAllNotes,
  createnote,
  updateNote,
  deleteNotes,
} = require("../../controllers/noteControllers");

const noteModel = require("../../models/noteModel");

jest.mock("../../models/noteModel");

describe("Note Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1 },
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllNotes", () => {
    it("should return notes for user", async () => {
      noteModel.getNotesByUserId.mockResolvedValue([
        { id: 1, title: "Note 1" },
      ]);

      await getAllNotes(req, res);

      expect(noteModel.getNotesByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, title: "Note 1" }]);
    });

    it("should return 500 on error", async () => {
      noteModel.getNotesByUserId.mockRejectedValue(new Error("DB error"));

      await getAllNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "server error" }); // keep typo here if not fixed in controller
    });
  });

  describe("createnote", () => {
    it("should return 400 if fields are missing", async () => {
      req.body = { title: "", content: "" };

      await createnote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "title and content is required",
      });
    });

    it("should create note and return 200", async () => {
      req.body = { title: "New Note", content: "Note content" };
      const newNote = { id: 1, title: "New Note", content: "Note content" };

      noteModel.createNoteInDb.mockResolvedValue(newNote);

      await createnote(req, res);

      expect(noteModel.createNoteInDb).toHaveBeenCalledWith(
        1,
        "New Note",
        "Note content"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "created successfully",
        newNote,
      });
    });

    it("should return 500 if creation fails", async () => {
      req.body = { title: "Oops", content: "Fails" };

      noteModel.createNoteInDb.mockRejectedValue(new Error("fail"));

      await createnote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "failed to create note",
      });
    });
  });

  describe("updateNote", () => {
    beforeEach(() => {
      req.params.id = "1";
      req.body = { title: "Updated", content: "Updated content" };
    });

    it("should return 200 if updated", async () => {
      noteModel.updateNoteInDb.mockResolvedValue(true);

      await updateNote(req, res);

      expect(noteModel.updateNoteInDb).toHaveBeenCalledWith(
        "1",
        1,
        "Updated",
        "Updated content"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "note updated" });
    });

    it("should return 404 if not found/unauthorized", async () => {
      noteModel.updateNoteInDb.mockResolvedValue(false);

      await updateNote(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "note not found UnAuthorized",
      });
    });

    it("should return 501 if error occurs", async () => {
      noteModel.updateNoteInDb.mockRejectedValue(new Error("Update fail"));

      await updateNote(req, res);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith({ message: "its not update" });
    });
  });

  describe("deleteNotes", () => {
    beforeEach(() => {
      req.params.id = "1";
    });

    it("should return 200 if note deleted", async () => {
      noteModel.deleteNote.mockResolvedValue(true);

      await deleteNotes(req, res);

      expect(noteModel.deleteNote).toHaveBeenCalledWith("1", 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "note is deleted" });
    });

    it("should return 404 if note not deleted", async () => {
      noteModel.deleteNote.mockResolvedValue(false);

      await deleteNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "note is not delete or unauthorized",
      });
    });

    it("should return 500 on server error", async () => {
      noteModel.deleteNote.mockRejectedValue(new Error("delete error"));

      await deleteNotes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "failed to delete" });
    });
  });
});
