import db from "../db.js";

// GET
export const getAlbums = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT al.id, al.title, al.release_date, ar.name as artista 
            FROM albums al
            JOIN artists ar ON al.artist_id = ar.id
        `);
        res.status(200).json(rows);
    } catch (erro) {
        res.status(500).send("Erro no banco: " + erro.message);
    }
};

// POST 
export const createAlbum = async (req, res) => {
    try {
        const { titulo, artista_id, ano_lancamento } = req.body;

        const [result] = await db.query(
            "INSERT INTO albums (title, artist_id, release_date) VALUES (?, ?, ?)",
            [titulo, artista_id, ano_lancamento]
        );

        const [rows] = await db.query(
            `SELECT 
                al.id AS id,           ← ← ADICIONE ESTA LINHA
                al.title AS album,
                al.release_date AS ano,
                ar.name AS artista
             FROM albums al
             JOIN artists ar ON ar.id = al.artist_id
             WHERE al.id = ?`,
            [result.insertId]
        );

        return res.status(201).json(rows[0]);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
};


// PUT
export const updateAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, artista_id, ano_lancamento } = req.body;

        if (!titulo || !artista_id || !ano_lancamento) {
            return res.status(400).json({ erro: "Envie titulo, artista_id e ano_lancamento" });
        }

        const [result] = await db.query(
            "UPDATE albums SET title = ?, artist_id = ?, release_date = ? WHERE id = ?",
            [titulo, artista_id, ano_lancamento, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: "Álbum não encontrado" });
        }

        return res.status(200).json({ id: Number(id), titulo, artista_id, ano_lancamento });
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
};

// DELETE
export const deleteAlbum = async (req, res) => {
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
};
