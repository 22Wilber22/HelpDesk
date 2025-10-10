import pool from '../../config/db.js';
import bcrypt from 'bcrypt';

export const getUser = async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Usuarios'); 
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  export const getUserById = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const [rows] = await pool.query('SELECT * FROM Usuarios WHERE usuario_id = ?', [usuario_id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const postUser = async (req, res) => {
    try {
        const { nombre_completo, correo, telefono, rol, password, estado } = req.body;

        // Hash the password before storing
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query(
            `INSERT INTO Usuarios (nombre_completo, correo, telefono, rol, password_hash, estado) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre_completo, correo, telefono, rol, password_hash, estado || 'activo']
        );

        res.status(201).json({
            message: 'Usuario creado correctamente',
            userId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
export const patchUser = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const fieldsToUpdate = req.body;

        const allowedFields = ['nombre_completo', 'correo', 'telefono', 'rol', 'estado'];
        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (fieldsToUpdate[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(fieldsToUpdate[field]);
            }
        }

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

        const [result] = await pool.query(`UPDATE Usuarios SET ${updates.join(', ')} WHERE usuario_id = ?`, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
    }
};



export const deleteUser = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        // En lugar de borrar, actualizamos el estado a 'Desactivado'
        const [result] = await pool.query(
          "UPDATE Usuarios SET estado = 'inactivo' WHERE usuario_id = ?",
          [usuario_id]
        );
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
    
        res.json({ message: "Usuario desactivado correctamente" });
      } catch (error) {
        res.status(500).json({ error: "Error al desactivar Usuario" });
      }
};
