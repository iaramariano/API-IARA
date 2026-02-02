import db from "../db.js";

// GET
export const getSongs = async (req, res) => {
    try {
      
        const [rows] = await db.query(`
            SELECT s.id, s.title, s.duracao_segundos, 
                   a.title as album, ar.name as artista
            FROM songs s
            JOIN albums a ON s.album_id = a.id
            JOIN artists ar ON s.artist_id = ar.id
        `);
        res.status(200).json(rows);
    } catch (erro) {
        res.status(500).send("Erro no banco: " + erro.message);
    }
};

// POST 
export const createSong = async (req, res) => {
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
};

// PUT 
export const updateSong = async (req, res) => {
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
};

// DELETE
export const deleteSong = async (req, res) => {
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
};
