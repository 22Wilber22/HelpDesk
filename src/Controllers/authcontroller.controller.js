// Registro para clientes (pública - sin autenticación)
export const registerCliente = async (req, res) => {
    let connection;
    try {
        const { nombre, correo, telefono, password, empresa, area, direccion, notas } = req.body;
        connection = await pool.getConnection();

        // Verificar si el correo ya existe en Clientes
        const [existingCliente] = await connection.query(
            'SELECT cliente_id FROM Clientes WHERE correo = ?',
            [correo]
        );

        if (existingCliente.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        const bcrypt = await import('bcryptjs');
        const password_hash = await bcrypt.hash(password, 10);

        // Crear cliente
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

// Login que funciona para Usuarios y Clientes
export const login = async (req, res) => {
    let connection;
    try {
        const { correo, password } = req.body;
        connection = await pool.getConnection();

        // Validar campos requeridos
        if (!correo || !password) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        // Primero buscar en Usuarios
        let [rows] = await connection.query(
            'SELECT usuario_id as id, nombre_completo as nombre, correo, rol, password_hash, estado, "usuario" as tipo FROM Usuarios WHERE correo = ?',
            [correo]
        );

        let user = rows[0];

        // Si no está en Usuarios, buscar en Clientes
        if (!user) {
            [rows] = await connection.query(
                'SELECT cliente_id as id, nombre, correo, "Cliente" as rol, password_hash, estado, "cliente" as tipo FROM Clientes WHERE correo = ?',
                [correo]
            );
            user = rows[0];
        }

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar si está activo
        if (user.estado !== 'activo' && user.estado !== 1) {
            return res.status(401).json({ error: 'Usuario desactivado' });
        }

        // Verificar contraseña
        const isValidPassword = await comparePassword(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = generateToken(user.id, user.correo, user.rol);

        // Responder con token y datos del usuario
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre_completo || user.nombre,
                correo: user.correo,
                rol: user.rol,
                tipo: user.tipo,
                estado: user.estado
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) connection.release();
    }
};