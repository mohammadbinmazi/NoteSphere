const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoute = require("./routes/noteRoute");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
