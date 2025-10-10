import pool from '../../config/db.js';




export const getUser = async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Usuarios'); 
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };



// Endpoint GET → obtener todos los tickets
export const getTickets = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Tickets");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tickets" });
  }
};



// Endpoint GET → obtener un ticket por su ID -> para poder buscarlo por el id
export const getTicketById = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Tickets WHERE ticket_id = ?",
      [ticket_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(rows[0]); // Devolvemos el primer (y único) resultado
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};



// Endpoint POST → crear un nuevo ticket
export const createTicket = async (req, res) => {
  try {
    const { cliente_id, agente_id, categoria_id, prioridad, descripcion } = req.body;

    // Obtener el último ticket creado para calcular el siguiente número
    const [lastTicket] = await pool.query("SELECT numero_ticket FROM Tickets ORDER BY ticket_id DESC LIMIT 1");

    let nextId = 1;
    if (lastTicket.length > 0) {
      // Extraer solo el número como entero, asumiendo formato TCK-0001
      const lastNumber = parseInt(lastTicket[0].numero_ticket.split('-')[1], 10);
      nextId = lastNumber + 1;
    }

    // Generar el número de ticket con ceros a la izquierda
    const numero_ticket = `TCK-${String(nextId).padStart(4, '0')}`;

    //Insertar el ticket en la base de datos
    const [result] = await pool.query(
      "INSERT INTO Tickets (numero_ticket, cliente_id, agente_id, categoria_id, prioridad, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
      [numero_ticket, cliente_id, agente_id, categoria_id, prioridad, descripcion]
    );

    res.json({ message: "Ticket creado", ticketId: result.insertId, numero_ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear ticket" });
  }
};


// Endpoint DELETE -> cancelar un ticket (marcado lógico)
export const cancelTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    // En lugar de borrar, actualizamos el estado a 'Cancelado'
    const [result] = await pool.query(
      "UPDATE Tickets SET estado = 'Cancelado' WHERE ticket_id = ?",
      [ticket_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket cancelado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cancelar ticket" });
  }
};



// Endpoint PATCH -> actualizar parcialmente un ticket
export const updateTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const fieldsToUpdate = req.body;

    // Lista de campos que permitimos actualizar para evitar que se cambien campos sensibles
    const allowedFields = ["agente_id", "categoria_id", "prioridad", "descripcion", "estado"];

    const updates = [];
    const values = [];

    // Construimos la consulta dinámicamente solo con los campos permitidos
    for (const field of allowedFields) {
      if (fieldsToUpdate[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(fieldsToUpdate[field]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron campos para actualizar." });
    }

    values.push(ticket_id); // Añadimos el ID al final para el WHERE

    const [result] = await pool.query(`UPDATE Tickets SET ${updates.join(", ")} WHERE ticket_id = ?`, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar ticket:", error);
    res.status(500).json({ error: "Error al actualizar ticket", details: error.message });
  }
};

