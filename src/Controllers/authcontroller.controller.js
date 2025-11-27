// src/controllers/authController.js
import pool from '../../config/db.js';
import { generateToken, comparePassword } from '../../config/jwt.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
    let connection;
    try {
        const { correo, password } = req.body;
        connection = await pool.getConnection();

        if (!correo || !password) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        // Buscar en Usuarios
        const [rows] = await connection.query(
            'SELECT usuario_id as id, nombre_completo as nombre, correo, rol, password_hash, estado FROM Usuarios WHERE correo = ?',
            [correo]
        );

        let user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (user.estado !== 'activo') {
            return res.status(401).json({ error: 'Usuario desactivado' });
        }

        // Debug: Log para verificar (remover en producción)
        console.log('Intentando login para:', correo);
        console.log('Password recibida (primeros 10 chars):', password.substring(0, 10));
        console.log('Hash almacenado (primeros 20 chars):', user.password_hash?.substring(0, 20));
        console.log('Estado del usuario:', user.estado);

        const isValidPassword = await comparePassword(password, user.password_hash);
        console.log('Resultado de comparación de contraseña:', isValidPassword);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = generateToken(user.id, user.correo, user.rol);

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) connection.release();
    }
};

export const verifyAuth = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.query(
            'SELECT usuario_id, nombre_completo, correo, rol, estado FROM Usuarios WHERE usuario_id = ?',
            [req.user.userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = rows[0];

        res.json({
            authenticated: true,
            user: {
                usuario_id: user.usuario_id,
                nombre_completo: user.nombre_completo,
                correo: user.correo,
                rol: user.rol,
                estado: user.estado
            }
        });

    } catch (error) {
        console.error('Error en verifyAuth:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) connection.release();
    }
};

export const changePassword = async (req, res) => {
    let connection;
    try {
        const { currentPassword, newPassword } = req.body;
        const usuario_id = req.user.userId;

        connection = await pool.getConnection();

        const [rows] = await connection.query(
            'SELECT password_hash FROM Usuarios WHERE usuario_id = ?',
            [usuario_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isValidPassword = await comparePassword(currentPassword, rows[0].password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await connection.query(
            'UPDATE Usuarios SET password_hash = ? WHERE usuario_id = ?',
            [newPasswordHash, usuario_id]
        );

        res.json({ message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error('Error en changePassword:', error);
        res.status(500).json({ error: 'Error al cambiar contraseña' });
    } finally {
        if (connection) connection.release();
    }
};

export const registerCliente = async (req, res) => {
    let connection;
    try {
        const { nombre, correo, telefono, password, empresa, area, direccion, notas } = req.body;
        connection = await pool.getConnection();

        const [existingCliente] = await connection.query(
            'SELECT cliente_id FROM Clientes WHERE correo = ?',
            [correo]
        );

        if (existingCliente.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await connection.query(
            `INSERT INTO Clientes 
             (nombre, correo, telefono, password_hash, empresa, area, direccion, notas, activo)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [nombre, correo, telefono, password_hash, empresa, area, direccion, notas]
        );

        res.status(201).json({
            message: 'Cliente registrado correctamente',
            cliente_id: result.insertId
        });

    } catch (error) {
        console.error('Error en registerCliente:', error);
        res.status(500).json({ error: 'Error al registrar cliente' });
    } finally {
        if (connection) connection.release();
    }
};