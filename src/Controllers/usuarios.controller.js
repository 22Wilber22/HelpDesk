import pool from '../../config/db.js';
import bcrypt from 'bcryptjs';

export const getUser = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM Usuarios'); 
        res.json(rows);
    } catch (err) {
        console.error('Error en getUser:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
};

export const getUserById = async (req, res) => {
    let connection;
    try {
        const { usuario_id } = req.params;
        connection = await pool.getConnection();
        
        const [rows] = await connection.query(
            'SELECT * FROM Usuarios WHERE usuario_id = ?', 
            [usuario_id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Error en getUserById:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
};

export const postUser = async (req, res) => {
    let connection;
    try {
        const { nombre_completo, correo, telefono, rol, password, estado } = req.body;
        connection = await pool.getConnection();

        // Hash de la contraseña antes de almacenar
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const [result] = await connection.query(
            `INSERT INTO Usuarios (nombre_completo, correo, telefono, rol, password_hash, estado) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre_completo, correo, telefono, rol, password_hash, estado || 'activo']
        );

        res.status(201).json({
            message: 'Usuario creado correctamente',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error en postUser:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

export const patchUser = async (req, res) => {
    let connection;
    try {
        const { usuario_id } = req.params;
        const fieldsToUpdate = req.body;
        connection = await pool.getConnection();

        const allowedFields = ['nombre_completo', 'correo', 'telefono', 'rol', 'estado'];
        const updates = [];
        const values = [];

        // Construir campos de actualización permitidos
        for (const field of allowedFields) {
            if (fieldsToUpdate[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(fieldsToUpdate[field]);
            }
        }

        // Manejar actualización de contraseña por separado
        if (fieldsToUpdate.password !== undefined) {
            const saltRounds = 10;
            const password_hash = await bcrypt.hash(fieldsToUpdate.password, saltRounds);
            updates.push('password_hash = ?');
            values.push(password_hash);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar.' });
        }

        values.push(usuario_id);

        const [result] = await connection.query(
            `UPDATE Usuarios SET ${updates.join(', ')} WHERE usuario_id = ?`, 
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error en patchUser:', error);
        res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
    } finally {
        if (connection) connection.release();
    }
};

export const deleteUser = async (req, res) => {
    let connection;
    try {
        const { usuario_id } = req.params;
        connection = await pool.getConnection();
        
        // Actualizar estado a inactivo en lugar de borrar
        const [result] = await connection.query(
            "UPDATE Usuarios SET estado = 'inactivo' WHERE usuario_id = ?",
            [usuario_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario desactivado correctamente" });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({ error: "Error al desactivar Usuario" });
    } finally {
        if (connection) connection.release();
    }
};