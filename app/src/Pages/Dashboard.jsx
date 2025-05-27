import React, { useState, useEffect } from "react";
import {
  getAllNotes,
  deleteNote,
  createNote,
  updateNote,
} from "../Services/note";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiEdit2, FiTrash2, FiPlus, FiCheck } from "react-icons/fi";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", id: null });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const data = await getAllNotes(token);
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (form.id) {
        await updateNote(
          form.id,
          { title: form.title, content: form.content },
          token
        );
      } else {
        await createNote({ title: form.title, content: form.content }, token);
      }
      setForm({ title: "", content: "", id: null });
      await fetchNotes();
    } catch (err) {
      console.error("Error saving note", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (note) => {
    setForm(note);
    document
      .getElementById("form-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id, token);
        await fetchNotes();
      } catch (error) {
        console.error("Error deleting note", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-indigo-600">Note</span>Sphere
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Stats */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-xs border border-gray-200">
            <p className="text-sm text-gray-600">
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1 ? "note" : "notes"}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <section id="form-section" className="mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {form.id ? (
                  <span className="flex items-center gap-2">
                    <FiEdit2 className="text-indigo-600" />
                    Edit Note
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiPlus className="text-indigo-600" />
                    Create New Note
                  </span>
                )}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter a title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    placeholder="Write your note here..."
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white ${
                      form.id
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-green-600 hover:bg-green-700"
                    } transition-colors ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <span className="animate-spin">↻</span>
                    ) : (
                      <FiCheck className="w-5 h-5" />
                    )}
                    {form.id ? "Update Note" : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Notes Grid */}
        <section>
          {isLoading && notes.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-500">
                Loading your notes...
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No notes found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : "Get started by creating a new note"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {note.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        #{String(note.id).slice(-4)}{" "}
                        {/* Shows last 4 chars of ID */}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-4 mb-4">
                      {note.content}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiEdit2 className="mr-1.5 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiTrash2 className="mr-1.5 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-200">
                    Created:{" "}
                    {new Date(
                      note.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
