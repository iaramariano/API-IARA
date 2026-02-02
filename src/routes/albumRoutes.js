import express from "express";
import { 
    getAlbums, 
    createAlbum, 
    updateAlbum, 
    deleteAlbum 
} from "../controllers/albumController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET público
router.get("/", getAlbums);

// POST/PUT/DELETE c token
router.post("/", authMiddleware, createAlbum);
router.put("/:id", authMiddleware, updateAlbum);
router.delete("/:id", authMiddleware, deleteAlbum);

export default router;
