import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  updatePassword,
  deleteUser
} from "../controllers/users.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//users
router.get("/", getUsers);
router.get("/find/:userId", getUser);
router.put("/:id", verifyUser, updateUser);
router.put("/password/:id", verifyUser, updatePassword);
router.delete("/:id" , deleteUser);


export default router;
