import pool from '../../config/db.js';

/* GET → Obtener todos los tickets */
export const getTickets = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Abrir conexión
    const [rows] = await connection.query("SELECT * FROM Tickets"); // Consulta general
    res.json(rows);
  } catch (error) {
    console.error("Error en getTickets:", error);
    res.status(500).json({ error: "Error al obtener tickets" });
  } finally {
    if (connection) connection.release(); // Liberar conexión
  }
};

/* GET → Obtener un ticket por ID */
export const getTicketById = async (req, res) => {
  let connection;
  try {
    const { ticket_id } = req.params; // Obtener ID desde URL
    connection = await pool.getConnection();

    const [rows] = await connection.query(
      "SELECT * FROM Tickets WHERE ticket_id = ?",
      [ticket_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(rows[0]); // Devolver registro único
  } catch (error) {
    console.error("Error en getTicketById:", error);
    res.status(500).json({ error: "Error al obtener el ticket" });
  } finally {
    if (connection) connection.release();
  }
};

/* POST → Crear un nuevo ticket */
export const createTicket = async (req, res) => {
  let connection;
  try {
    const { cliente_id, agente_id, categoria_id, prioridad, descripcion } = req.body;
    connection = await pool.getConnection();

    // Obtener el número del último ticket creado
    const [lastTicket] = await connection.query(
      "SELECT numero_ticket FROM Tickets ORDER BY ticket_id DESC LIMIT 1"
    );

    let nextId = 1;

    if (lastTicket.length > 0) {
      const lastNumber = parseInt(lastTicket[0].numero_ticket.split('-')[1], 10);
      nextId = lastNumber + 1; // Generar número consecutivo
    }

    const numero_ticket = `TCK-${String(nextId).padStart(4, '0')}`;

    // Insertar el nuevo ticket
    const [result] = await connection.query(
      "INSERT INTO Tickets (numero_ticket, cliente_id, agente_id, categoria_id, prioridad, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
      [numero_ticket, cliente_id, agente_id, categoria_id, prioridad, descripcion]
    );

    res.json({
      message: "Ticket creado",
      ticketId: result.insertId,
      numero_ticket
    });
  } catch (error) {
    console.error("Error en createTicket:", error);
    res.status(500).json({ error: "Error al crear ticket" });
  } finally {
    if (connection) connection.release();
  }
};

/* PATCH → Actualizar parcialmente un ticket */
export const updateTicket = async (req, res) => {
  let connection;
  try {
    const { ticket_id } = req.params;
    const fieldsToUpdate = req.body; // Campos recibidos para actualización

    connection = await pool.getConnection();

    const allowedFields = ["agente_id", "categoria_id", "prioridad", "descripcion", "estado"];
    const updates = [];
    const values = [];

    // Validar y asignar los campos permitidos
    for (const field of allowedFields) {
      if (fieldsToUpdate[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(fieldsToUpdate[field]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron campos para actualizar." });
    }

    values.push(ticket_id);

    const [result] = await connection.query(
      `UPDATE Tickets SET ${updates.join(", ")} WHERE ticket_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket actualizado correctamente" });
  } catch (error) {
    console.error("Error en updateTicket:", error);
    res.status(500).json({ error: "Error al actualizar ticket" });
  } finally {
    if (connection) connection.release();
  }
};

/* DELETE → Cancelar un ticket (cambiar estado) */
export const cancelTicket = async (req, res) => {
  let connection;
  try {
    const { ticket_id } = req.params;

    connection = await pool.getConnection();

    const [result] = await connection.query(
      "UPDATE Tickets SET estado = 'Cancelado' WHERE ticket_id = ?",
      [ticket_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket cancelado correctamente" });
  } catch (error) {
    console.error("Error en cancelTicket:", error);
    res.status(500).json({ error: "Error al cancelar ticket" });
  } finally {
    if (connection) connection.release();
  }
};

/* GET → Obtener usuarios */
export const getUser = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Conexión
    const [rows] = await connection.query('SELECT * FROM Usuarios'); // Consulta tabla Usuarios
    res.json(rows);
  } catch (err) {
    console.error("Error en getUser:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) connection.release();
  }
};
