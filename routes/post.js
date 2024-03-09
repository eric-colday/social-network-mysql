import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  likePost,
  updatePost,
} from "../controllers/post.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", addPost);
router.get("/", getPosts);
router.get("/find/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

router.put("/:id/like", likePost);


export default router;
