import express from "express";
import db from "./db.js";

const app = express();

app.use(express.json());


const artistas = [
    { id: 1, nome: "Taylor Swift"},
    { id: 2, nome: "Beyoncé" }
];

const albuns = [
    { id: 1, titulo: "Red", ano: 2012, artista_id: 1 },
    { id: 2, titulo: "Renaissance", ano: 2022, artista_id: 2 }
];

const musicas = [
    { id: 1, titulo: "I Knew You Were Trouble", duracao: 200, album_id: 1 },
    { id: 2, titulo: "Break My Soul", duracao: 278, album_id: 2 }
];


app.get("/", (req, res) => {
    res.status(200).json({ 
        mensagem: "Bem-vindo ao Spotify da Iara 🎵",
        endpoints: ["/artistas", "/albuns", "/musicas"]
    });
});

app.get("/artistas", async (req, res) => {
    try{
        const[rows] = await db.query('SELECT * FROM artists');
        res.status(200).json(rows);

    } catch (erro){
        res.status(500).send("Erro no banco: "+erro.message);
    }
});

app.get("/albuns", async (req, res) => {
    try{
        const[rows] = await db.query('SELECT * FROM albums');
        res.status(200).json(rows);
    } catch (erro){
        res.status(500).send("Erro no banco: "+erro.message);
    }
});

app.get("/musicas", async(req, res) => {
    try{
        const[rows] = await db.query('SELECT * FROM songs');
        res.status(200).json(rows);
    } catch (erro){
        res.status(500).send("Erro no banco: "+erro.message);
    }
});
app.post ("/artistas", async(req,res)=>{
    try{
        const{nome, genero} = req.body;
        const[result] = await db.query(
            'INSERT INTO artists (name, genre) VALUES (?,?)',
            [nome, genero]
        );
        res.status(201).json({
            id: result.insertId,
            nome,
            genero
        });
    } catch (erro){
        res.status(500).json({erro:erro.message});
    }
});
app.post("/albuns", async (req, res) => {
  try {
    const { titulo, artista_id, ano_lancamento } = req.body;

    const [result] = await db.query(
      "INSERT INTO albums (title, artist_id, release_year) VALUES (?, ?, ?)",
      [titulo, artista_id, ano_lancamento]
    );

    const [rows] = await db.query(
      `SELECT 
         al.title  AS album,
         al.release_year AS ano,
         ar.name   AS artista
       FROM albums al
       JOIN artists ar ON ar.id = al.artist_id
       WHERE al.id = ?`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

app.post("/musicas", async (req, res) => {
  try {
    const { titulo, album_id, artista_id, duracao_segundos } = req.body;

    const [result] = await db.query(
      "INSERT INTO songs (title, album_id, artist_id, duracao_segundos) VALUES (?, ?, ?, ?)",
      [titulo, album_id, artista_id, duracao_segundos]
    );

    const [rows] = await db.query(
      `SELECT
         s.title  AS musica,
         a.title  AS album,
         ar.name  AS artista,
         s.duracao_segundos
       FROM songs s
       JOIN albums a  ON a.id  = s.album_id
       JOIN artists ar ON ar.id = s.artist_id
       WHERE s.id = ?`,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});
app.put("/artistas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, genero } = req.body;

    if (!nome || !genero) {
      return res.status(400).json({ erro: "Envie nome e genero" });
    }

    const [result] = await db.query(
      "UPDATE artists SET name = ?, genre = ? WHERE id = ?",
      [nome, genero, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Artista não encontrado" });
    }

    return res.status(200).json({ id: Number(id), nome, genero });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});
app.put("/albuns/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, artista_id, ano_lancamento } = req.body;

    if (!titulo || !artista_id || !ano_lancamento) {
      return res.status(400).json({ erro: "Envie titulo, artista_id e ano_lancamento" });
    }

    const [result] = await db.query(
      "UPDATE albums SET title = ?, artist_id = ?, release_year = ? WHERE id = ?",
      [titulo, artista_id, ano_lancamento, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Álbum não encontrado" });
    }

    return res.status(200).json({ id: Number(id), titulo, artista_id, ano_lancamento });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});
app.put("/musicas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, album_id, artista_id } = req.body;

        const [result] = await db.query(
            "UPDATE songs SET title = ?, album_id = ?, artist_id = ? WHERE id = ?",
            [titulo, album_id, artista_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Música não encontrada" });
        }

        const [dados] = await db.query(`
            SELECT 
                s.title as musica,
                a.title as album,
                art.name as artista
            FROM songs s
            JOIN albums a ON s.album_id = a.id
            JOIN artists art ON s.artist_id = art.id
            WHERE s.id = ?
        `, [id]);

        res.status(200).json(dados[0]);

    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});
app.delete("/artistas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM artists WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Artista não encontrado" });
    }

    return res.status(200).json({ mensagem: "Artista deletado com sucesso!" });
  } catch (erro) {
    if (erro.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ erro: "Não é possível deletar o artista pois ele tem álbuns vinculados." });
    }
    return res.status(500).json({ erro: erro.message });
  }
});
app.delete("/albuns/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM albums WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Álbum não encontrado" });
    }

    return res.status(200).json({ mensagem: "Álbum deletado com sucesso!" });
  } catch (erro) {
     if (erro.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ erro: "Não é possível deletar o álbum pois ele tem músicas vinculadas." });
    }
    return res.status(500).json({ erro: erro.message });
  }
});
app.delete("/musicas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM songs WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Música não encontrada" });
    }

    return res.status(200).json({ mensagem: "Música deletada com sucesso!" });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});



export default app;
