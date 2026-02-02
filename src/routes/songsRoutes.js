import express from "express";
import { 
    getSongs, 
    createSong, 
    updateSong, 
    deleteSong 
} from "../controllers/songsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET público 
router.get("/", getSongs);

// POST/PUT/DELETE c token
router.post("/", authMiddleware, createSong);
router.put("/:id", authMiddleware, updateSong);
router.delete("/:id", authMiddleware, deleteSong);

export default router;
