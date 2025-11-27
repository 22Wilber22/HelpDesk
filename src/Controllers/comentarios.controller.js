import pool from '../../config/db.js';

// Crear comentario
export const crearComentario = async (req, res) => {
    let connection;
    try {
        const { ticket_id, usuario_id, texto } = req.body;
        
        // Obtener conexión del pool
        connection = await pool.getConnection();
        
        const [result] = await connection.query(
            'INSERT INTO Comentarios (ticket_id, usuario_id, texto) VALUES (?, ?, ?)',
            [ticket_id, usuario_id, texto]
        );
        
        res.status(201).json({ 
            mensaje: 'Comentario creado', 
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error en crearComentario:', error);
        res.status(500).json({ error: 'Error al crear comentario' });
    } finally {
        // Liberar conexión siempre
        if (connection) connection.release();
    }
};

// Editar comentario
export const editarComentario = async (req, res) => {
    let connection;
    try {
        const { comentarioId } = req.params;
        const { texto } = req.body;
        
        // Obtener conexión del pool
        connection = await pool.getConnection();
        
        const [result] = await connection.query(
            'UPDATE Comentarios SET texto = ? WHERE comentario_id = ?',
            [texto, comentarioId]
        );
        
        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }
        
        res.json({ mensaje: 'Comentario actualizado' });
    } catch (error) {
        console.error('Error en editarComentario:', error);
        res.status(500).json({ error: 'Error al editar comentario' });
    } finally {
        // Liberar conexión siempre
        if (connection) connection.release();
    }
};

// Obtener todos los comentarios
export const obtenerComentarios = async (req, res) => {
    let connection;
    try {
        // Obtener conexión del pool
        connection = await pool.getConnection();
        
        const [rows] = await connection.query("SELECT * FROM Comentarios");
        res.json(rows);
    } catch (error) {
        console.error('Error en obtenerComentarios:', error);
        res.status(500).json({ error: 'Error al obtener comentarios' });
    } finally {
        // Liberar conexión siempre
        if (connection) connection.release();
    }
};

// Obtener comentarios por ticket específico
export const obtenerComentariosPorTicket = async (req, res) => {
    let connection;
    try {
        const { ticket_id } = req.params;

        // Validar parámetro requerido
        if (!ticket_id) {
            return res.status(400).json({ error: 'Falta el parámetro ticket_id' });
        }

        // Obtener conexión del pool
        connection = await pool.getConnection();

        // Consulta segura con parámetros
        const [rows] = await connection.query(
            'SELECT * FROM Comentarios WHERE ticket_id = ? ORDER BY fecha_creacion DESC',
            [ticket_id]
        );

        // Si no hay comentarios, enviar array vacío en lugar de error
        res.status(200).json(rows);
        
    } catch (error) {
        console.error('Error en obtenerComentariosPorTicket:', error);
        res.status(500).json({ error: 'Error interno al obtener comentarios por ticket' });
    } finally {
        // Liberar conexión siempre
        if (connection) connection.release();
    }
};