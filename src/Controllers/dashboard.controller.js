import pool from '../../config/db.js';

export const getDashboardStats = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { rol, userId, email } = req.user;

        let whereClause = "";
        let params = [];

        // Definir filtros según el rol
        if (rol === 'Usuario') {
            // Obtener cliente_id asociado al usuario
            const [clientes] = await connection.query('SELECT cliente_id FROM Clientes WHERE correo = ?', [email]);
            if (clientes.length > 0) {
                whereClause = "WHERE cliente_id = ?";
                params = [clientes[0].cliente_id];
            } else {
                // Si es usuario pero no tiene cliente asociado, no tiene tickets
                return res.json({
                    total: 0,
                    por_estado: [],
                    por_prioridad: []
                });
            }
        } else if (rol === 'Agente') {
            // Agente ve solo sus tickets asignados
            whereClause = "WHERE agente_id = ?";
            params = [userId];
        }
        // Admin y Supervisor ven todo (whereClause vacío)

        // 1. Total de tickets
        const [totalRows] = await connection.query(
            `SELECT COUNT(*) as total FROM Tickets ${whereClause}`,
            params
        );

        // 2. Conteo por Estado
        const [estadoRows] = await connection.query(
            `SELECT estado, COUNT(*) as cantidad FROM Tickets ${whereClause} GROUP BY estado`,
            params
        );

        // 3. Conteo por Prioridad
        const [prioridadRows] = await connection.query(
            `SELECT prioridad, COUNT(*) as cantidad FROM Tickets ${whereClause} GROUP BY prioridad`,
            params
        );

        res.json({
            total: totalRows[0].total,
            por_estado: estadoRows,
            por_prioridad: prioridadRows
        });

    } catch (error) {
        console.error("Error en getDashboardStats:", error);
        res.status(500).json({ error: "Error al obtener estadísticas del dashboard" });
    } finally {
        if (connection) connection.release();
    }
};
