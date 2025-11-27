import pool from '../../config/db.js';
import bcrypt from 'bcrypt';

// Obtener todos los clientes activos
export const getClientes = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      `SELECT 
          cliente_id,
          nombre,
          correo,
          telefono,
          empresa,
          area,
          direccion,
          notas,
          activo
       FROM Clientes`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error en getClientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};

// Obtener cliente por ID
export const getClienteById = async (req, res) => {
  let connection;
  try {
    const { cliente_id } = req.params;
    connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      `SELECT 
          cliente_id,
          nombre,
          correo,
          telefono,
          empresa,
          area,
          direccion,
          notas,
          activo
       FROM Clientes
       WHERE cliente_id = ?`,
      [cliente_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getClienteById:', error);
    res.status(500).json({ error: 'Error al obtener cliente', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};

// Crear nuevo cliente
export const postCliente = async (req, res) => {
  let connection;
  try {
    const {
      nombre,
      correo,
      telefono,
      password,
      empresa,
      area,
      direccion,
      notas
    } = req.body;

    connection = await pool.getConnection();

    // Cifrar contraseña si se proporciona
    const password_hash = password ? await bcrypt.hash(password, 10) : null;

    const [result] = await connection.query(
      `INSERT INTO Clientes 
       (nombre, correo, telefono, password_hash, empresa, area, direccion, notas, activo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [nombre, correo, telefono, password_hash, empresa, area, direccion, notas]
    );

    res.status(201).json({
      message: 'Cliente creado correctamente',
      cliente_id: result.insertId,
    });
  } catch (error) {
    console.error('Error en postCliente:', error);
    res.status(500).json({ error: 'Error al crear cliente', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};

// Actualizar cliente parcialmente
export const patchCliente = async (req, res) => {
  let connection;
  try {
    const { cliente_id } = req.params;
    const fieldsToUpdate = req.body;

    connection = await pool.getConnection();

    const allowedFields = [
      'nombre',
      'correo',
      'telefono',
      'empresa',
      'area',
      'direccion',
      'notas',
      'activo'
    ];

    const updates = [];
    const values = [];

    // Construir campos de actualización
    for (const field of allowedFields) {
      if (fieldsToUpdate[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(fieldsToUpdate[field]);
      }
    }

    // Manejar actualización de contraseña
    if (fieldsToUpdate.password !== undefined) {
      const password_hash = await bcrypt.hash(fieldsToUpdate.password, 10);
      updates.push('password_hash = ?');
      values.push(password_hash);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar.' });
    }

    values.push(cliente_id);

    const [result] = await connection.query(
      `UPDATE Clientes SET ${updates.join(', ')} WHERE cliente_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error('Error en patchCliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};

// Desactivar (eliminar lógico) cliente
export const deleteCliente = async (req, res) => {
  let connection;
  try {
    const { cliente_id } = req.params;
    connection = await pool.getConnection();

    const [result] = await connection.query(
      `UPDATE Clientes SET activo = 0 WHERE cliente_id = ?`,
      [cliente_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente desactivado correctamente' });
  } catch (error) {
    console.error('Error en deleteCliente:', error);
    res.status(500).json({ error: 'Error al desactivar cliente', details: error.message });
  } finally {
    if (connection) connection.release();
  }
};