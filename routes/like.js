import express from "express";
import { addLike, deleteLike, getLikes } from "../controllers/like.js";

const router = express.Router();

router.post("/", addLike)
router.get("/", getLikes)
router.delete("/:id", deleteLike)

export default router;