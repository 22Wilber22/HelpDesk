import { Router } from "express";
import { getTickets, getTicketById, createTicket, cancelTicket, updateTicket } from "../Controllers/ticket.controllers.js";

const router = Router();

router.get("/", getTickets);
router.post("/", createTicket);
router.delete("/:ticket_id", cancelTicket);
router.patch("/:ticket_id", updateTicket);
router.get("/:ticket_id", getTicketById);

export default router;



/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Endpoints para la gestión de tickets de soporte
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Obtener todos los tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Lista de tickets obtenida correctamente
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   get:
 *     summary: Obtener un ticket por ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del ticket
 *       404:
 *         description: Ticket no encontrado
 */

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Crear un nuevo ticket de soporte
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: integer
 *                 example: 1
 *               agente_id:
 *                 type: integer
 *                 example: 2
 *               categoria_id:
 *                 type: integer
 *                 example: 3
 *               prioridad:
 *                 type: string
 *                 example: "Alta"
 *               descripcion:
 *                 type: string
 *                 example: "El sistema no carga correctamente"
 *     responses:
 *       201:
 *         description: Ticket creado correctamente
 *       500:
 *         description: Error al crear el ticket
 */

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   patch:
 *     summary: Actualizar un ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "Resuelto"
 *               prioridad:
 *                 type: string
 *                 example: "Media"
 *     responses:
 *       200:
 *         description: Ticket actualizado correctamente
 *       404:
 *         description: Ticket no encontrado
 */

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   delete:
 *     summary: Eliminar o cerrar un ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket eliminado correctamente
 *       404:
 *         description: Ticket no encontrado
 */
