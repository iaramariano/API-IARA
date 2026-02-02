import express from "express";
import artistRoutes from "./routes/artistRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import songsRoutes from "./routes/songsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "Bem-vindo ao Spotify da Iara 🎵",
    endpoints: ["/auth/login", "/artistas", "/albuns", "/musicas"]
  });
});

app.use("/auth", authRoutes);

app.use("/artistas", artistRoutes);
app.use("/albuns", albumRoutes);
app.use("/musicas", songsRoutes);

export default app;
