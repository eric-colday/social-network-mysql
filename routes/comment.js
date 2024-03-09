import express from "express";
import { addComment, deleteComment, getComment, getComments, updateComment } from "../controllers/comment.js";

const router = express.Router();

router.post("/", addComment);
router.get("/", getComments);
router.get("/find/:id", getComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;