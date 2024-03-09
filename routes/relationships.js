import express from "express";
import { 
    getRelationships, 
    addRelationships, 
     deleteRelationships 
    } from "../controllers/relationships.js";

const router = express.Router();

router.post("/", addRelationships);
router.delete("/", deleteRelationships);
router.get("/", getRelationships); 

export default router;