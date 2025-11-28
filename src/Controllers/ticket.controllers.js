import pool from '../../config/db.js';

/* GET → Obtener todos los tickets */
/* GET → Obtener todos los tickets */
export const getTickets = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Abrir conexión

    const query = `
      SELECT t.*, c.nombre as cliente_nombre, c.correo as cliente_correo, c.telefono as cliente_telefono 
      FROM Tickets t
      JOIN Clientes c ON t.cliente_id = c.cliente_id
    `;

    // Si es Usuario, filtrar por su cliente_id asociado al correo
    if (req.user.rol === 'Usuario') {
      const [clientes] = await connection.query(
        'SELECT cliente_id FROM Clientes WHERE correo = ?',
        [req.user.email]
      );

      if (clientes.length === 0) {
        return res.json([]); // No tiene tickets porque no es cliente aún
      }

      const cliente_id = clientes[0].cliente_id;
      const [rows] = await connection.query(`${query} WHERE t.cliente_id = ?`, [cliente_id]);
      res.json(rows);
    } else {
      // Admin, Supervisor, Agente ven todo
      const [rows] = await connection.query(query);
      res.json(rows);
    }
  } catch (error) {
    console.error("Error en getTickets:", error);
    res.status(500).json({ error: "Error al obtener tickets" });
  } finally {
    if (connection) connection.release(); // Liberar conexión
  }
};

/* GET → Obtener un ticket por ID */
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

    const ticket = rows[0];

    // Si es Usuario, verificar que el ticket le pertenezca
    if (req.user.rol === 'Usuario') {
      const [clientes] = await connection.query(
        'SELECT cliente_id FROM Clientes WHERE correo = ?',
        [req.user.email]
      );

      if (clientes.length === 0 || ticket.cliente_id !== clientes[0].cliente_id) {
        return res.status(403).json({ error: "No tienes permiso para ver este ticket" });
      }
    }

    res.json(ticket); // Devolver registro único
  } catch (error) {
    console.error("Error en getTicketById:", error);
    res.status(500).json({ error: "Error al obtener el ticket" });
  } finally {
    if (connection) connection.release();
  }
};

/* POST → Crear un nuevo ticket */
/* POST → Crear un nuevo ticket */
export const createTicket = async (req, res) => {
  let connection;
  try {
    let { cliente_id, agente_id, categoria_id, prioridad, descripcion } = req.body;

    // Validar campos requeridos (cliente_id es opcional si es Usuario)
    if (!categoria_id || !prioridad || !descripcion) {
      return res.status(400).json({
        error: 'Campos requeridos: categoria_id, prioridad, descripcion'
      });
    }

    // Si NO es usuario, cliente_id es obligatorio
    if (req.user.rol !== 'Usuario' && !cliente_id) {
      return res.status(400).json({ error: 'Campo requerido: cliente_id' });
    }

    connection = await pool.getConnection();

    // Lógica para Usuario: Auto-asignar o crear cliente
    if (req.user.rol === 'Usuario') {
      // Buscar cliente por correo del usuario
      const [clientes] = await connection.query(
        'SELECT cliente_id FROM Clientes WHERE correo = ?',
        [req.user.email]
      );

      if (clientes.length > 0) {
        cliente_id = clientes[0].cliente_id;
      } else {
        // Si no existe como cliente, crearlo usando datos del usuario
        const [usuarios] = await connection.query(
          'SELECT nombre_completo, telefono FROM Usuarios WHERE usuario_id = ?',
          [req.user.userId]
        );

        if (usuarios.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const user = usuarios[0];

        const [result] = await connection.query(
          'INSERT INTO Clientes (nombre, correo, telefono, activo) VALUES (?, ?, ?, 1)',
          [user.nombre_completo, req.user.email, user.telefono]
        );
        cliente_id = result.insertId;
      }
    } else {
      // Lógica normal para Admin/Agente: Validar que el cliente existe
      const [cliente] = await connection.query(
        'SELECT cliente_id FROM Clientes WHERE cliente_id = ?',
        [cliente_id]
      );

      if (cliente.length === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
    }

    // Validar que la categoría existe
    const [categoria] = await connection.query(
      'SELECT categoria_id FROM Categorias WHERE categoria_id = ?',
      [categoria_id]
    );

    if (categoria.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Si se proporciona agente_id, validar que existe
    if (agente_id) {
      const [agente] = await connection.query(
        'SELECT usuario_id FROM Usuarios WHERE usuario_id = ? AND rol IN ("Agente", "Supervisor", "Admin")',
        [agente_id]
      );

      if (agente.length === 0) {
        return res.status(404).json({ error: 'Agente no encontrado o no tiene rol válido' });
      }
    }

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
      [numero_ticket, cliente_id, agente_id || null, categoria_id, prioridad, descripcion]
    );

    res.status(201).json({
      message: "Ticket creado",
      ticketId: result.insertId,
      numero_ticket
    });
  } catch (error) {
    console.error("Error en createTicket:", error);
    res.status(500).json({
      error: "Error al crear ticket",
      details: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};

/* PATCH → Actualizar parcialmente un ticket */
/* PATCH → Actualizar parcialmente un ticket */
export const updateTicket = async (req, res) => {
  let connection;
  try {
    const { ticket_id } = req.params;
    const fieldsToUpdate = req.body; // Campos recibidos para actualización

    connection = await pool.getConnection();

    // Lógica específica para Usuario
    if (req.user.rol === 'Usuario') {
      // 1. Verificar propiedad del ticket
      const [ticket] = await connection.query('SELECT cliente_id FROM Tickets WHERE ticket_id = ?', [ticket_id]);

      if (ticket.length === 0) {
        return res.status(404).json({ error: "Ticket no encontrado" });
      }

      const [cliente] = await connection.query('SELECT cliente_id FROM Clientes WHERE correo = ?', [req.user.email]);

      if (cliente.length === 0 || ticket[0].cliente_id !== cliente[0].cliente_id) {
        return res.status(403).json({ error: "No tienes permiso para editar este ticket" });
      }

      // 2. Restringir campos permitidos
      const allowedForUser = ["categoria_id", "prioridad", "descripcion"];
      const keys = Object.keys(fieldsToUpdate);

      // Verificar si intenta actualizar campos prohibidos
      const hasForbiddenFields = keys.some(key => !allowedForUser.includes(key));

      if (hasForbiddenFields) {
        // Opción A: Retornar error (más estricto)
        // return res.status(403).json({ error: "Solo puedes editar: categoría, prioridad y descripción" });

        // Opción B: Filtrar silenciosamente (más amigable)
        // Vamos a filtrar y solo dejar pasar los permitidos
        Object.keys(fieldsToUpdate).forEach(key => {
          if (!allowedForUser.includes(key)) {
            delete fieldsToUpdate[key];
          }
        });

        if (Object.keys(fieldsToUpdate).length === 0) {
          return res.status(400).json({ error: "No se proporcionaron campos válidos para actualizar" });
        }
      }
    }

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
/* DELETE → Cancelar un ticket (cambiar estado) */
export const cancelTicket = async (req, res) => {
  let connection;
  try {
    const { ticket_id } = req.params;

    connection = await pool.getConnection();

    // Lógica específica para Usuario
    if (req.user.rol === 'Usuario') {
      const [ticket] = await connection.query('SELECT cliente_id FROM Tickets WHERE ticket_id = ?', [ticket_id]);

      if (ticket.length === 0) {
        return res.status(404).json({ error: "Ticket no encontrado" });
      }

      const [cliente] = await connection.query('SELECT cliente_id FROM Clientes WHERE correo = ?', [req.user.email]);

      if (cliente.length === 0 || ticket[0].cliente_id !== cliente[0].cliente_id) {
        return res.status(403).json({ error: "No tienes permiso para cancelar este ticket" });
      }
    }

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
    res.status(500).json({
      error: "Error al cancelar ticket",
      details: error.message
    });
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
