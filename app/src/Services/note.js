import axios from "axios";
const API_URL = "http://localhost:5000/api/notes";

export const getAllNotes = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const createNote = async (note, token) => {
  const res = await axios.post(API_URL, note, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const deleteNote = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const updateNote = async (id, note, token) => {
  const res = await axios.put(`${API_URL}/${id}`, note, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
