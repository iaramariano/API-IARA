import express from "express";
import { getArtists, createArtist, updateArtist, deleteArtist } from "../controllers/artistController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET público
router.get("/", getArtists);

// POST/PUT/DELETE com token
router.post("/", authMiddleware, createArtist);
router.put("/:id", authMiddleware, updateArtist);
router.delete("/:id", authMiddleware, deleteArtist);

export default router;
