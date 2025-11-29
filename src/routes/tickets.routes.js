import express from 'express';
import { getTickets, getTicketById, createTicket, updateTicket, cancelTicket } from '../Controllers/ticket.controllers.js';
import { authenticateToken, requireRole } from "../../config/jwt.js";

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Obtener todos los tickets
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets
 */
router.get("/", requireRole(['Admin', 'Supervisor', 'Agente', 'Usuario']), getTickets);

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   get:
 *     summary: Obtener ticket por ID
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket encontrado
 */
router.get("/:ticket_id", requireRole(['Admin', 'Supervisor', 'Agente', 'Usuario']), getTicketById);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Crear nuevo ticket
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoria_id
 *               - prioridad
 *               - descripcion
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 description: ID del cliente (Obligatorio para Admin/Agente, Opcional para Usuario)
 *               categoria_id:
 *                 type: integer
 *               prioridad:
 *                 type: string
 *                 enum: [Baja, Media, Alta]
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket creado
 */
router.post("/", requireRole(['Admin', 'Supervisor', 'Agente', 'Usuario']), createTicket);

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   patch:
 *     summary: Actualizar ticket
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agente_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               prioridad:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket actualizado
 */
router.patch("/:ticket_id", requireRole(['Admin', 'Supervisor', 'Agente', 'Usuario']), updateTicket);

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   delete:
 *     summary: Cancelar ticket
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket cancelado
 */
router.delete("/:ticket_id", requireRole(['Admin', 'Supervisor', 'Usuario']), cancelTicket);

export default router;