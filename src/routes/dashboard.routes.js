import { Router } from "express";
import { getDashboardStats } from "../Controllers/dashboard.controller.js";
import { authenticateToken } from "../../config/jwt.js";

const router = Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Estadísticas y resumen del sistema
 */

/**
 * @swagger
 * /dashboard/resumen:
 *   get:
 *     summary: Obtener estadísticas de tickets
 *     description: Devuelve contadores de tickets filtrados según el rol del usuario (Admin/Supervisor=Global, Agente=Asignados, Usuario=Propios).
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 por_estado:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       estado:
 *                         type: string
 *                       cantidad:
 *                         type: integer
 *                 por_prioridad:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       prioridad:
 *                         type: string
 *                       cantidad:
 *                         type: integer
 */
router.get("/resumen", getDashboardStats);

export default router;
