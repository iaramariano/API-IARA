import express from "express";
import { 
    getArtists, 
    createArtist, 
    updateArtist, 
    deleteArtist 
} from "../controllers/artistController.js";

const router = express.Router();


router.get("/", getArtists);       // GET 
router.post("/", createArtist);    // POST 
router.put("/:id", updateArtist);  // PUT 
router.delete("/:id", deleteArtist); // DELETE 

export default router;
