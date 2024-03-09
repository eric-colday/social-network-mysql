import express from "express";
import { getAllStories, addStory, deleteStory } from "../controllers/story.js";

const router = express.Router();

router.post("/", addStory);
router.delete("/:id", deleteStory);
router.get("/", getAllStories);
// router.get("/", getStories);

export default router;
