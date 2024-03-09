import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import booksRoute from "./routes/books.js";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import postRoute from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import likeRoutes from "./routes/like.js";
import storyRoutes from "./routes/story.js";
import relationshipRoutes from "./routes/relationships.js";
import multer from "multer";

const app = express();
app.use(
  cors()
);
app.use(cookieParser());
app.use(express.json());

dotenv.config();

app.get("/", (req, res) => {
  res.json("hello Rico");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/books", booksRoute); 
app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/relationships", relationshipRoutes);


app.listen(8800, () => {
  console.log("Connected to backend.");
});
