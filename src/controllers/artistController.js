import db from "../db.js";

//GET
export const getArtists = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM artists');
        res.status(200).json(rows);
    } catch (erro) {
        res.status(500).send("Erro no banco: " + erro.message);
    }
};

//POST
export const createArtist = async (req, res) => {
    try {
        const { nome, genero } = req.body;
        const [result] = await db.query(
            'INSERT INTO artists (name, genre) VALUES (?,?)',
            [nome, genero]
        );
        res.status(201).json({ id: result.insertId, nome, genero });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
};

//PUT
export const updateArtist = async (req, res) => {
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
};

//DELETE
export const deleteArtist = async (req, res) => {
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
};
