import pool from '../../config/db.js';

/* GET → Obtener todas las categorías */
export const getCategorias = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM Categorias");
        res.json(rows);
    } catch (error) {
        console.error("Error en getCategorias:", error);
        res.status(500).json({ error: "Error al obtener categorías" });
    } finally {
        if (connection) connection.release();
    }
};
