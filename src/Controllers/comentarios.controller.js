import pool from '../../config/db.js';

// Crear comentario
export const crearComentario = async (req, res) => {
    try {
        const { ticket_id, usuario_id, texto } = req.body;
        const result = await pool.query(
            'INSERT INTO Comentarios (ticket_id, usuario_id, texto) VALUES (?, ?, ?)',
            [ticket_id, usuario_id, texto]
        );
        res.status(201).json({ mensaje: 'Comentario creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear comentario' });
    }
};

// Editar comentario
export const editarComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { texto } = req.body;
        await pool.query(
            'UPDATE Comentarios SET texto = ? WHERE comentario_id = ?',
            [texto, id]
        );
        res.json({ mensaje: 'Comentario actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al editar comentario' });
    }
};

export const obtenerComentarios = async (req, res) => {
    try {
    const [rows] = await pool.query("SELECT * FROM Comentarios");
    res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
};

export const obtenerComentariosPorTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    // Validar que el parámetro venga
    if (!ticket_id) {
      return res.status(400).json({ error: 'Falta el parámetro ticket_id' });
    }

    // Consulta segura
    const [rows] = await pool.query(
      'SELECT * FROM Comentarios WHERE ticket_id = ?',
      [ticket_id]
    );

    // Validar si hay resultados
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No hay comentarios para este ticket' });
    }

    // Enviar solo las filas
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener comentarios por ticket:', error);
    res.status(500).json({ error: 'Error interno al obtener comentarios por ticket' });
  }
};
