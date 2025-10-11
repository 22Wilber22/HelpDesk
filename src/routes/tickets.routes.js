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
 *   description: Endpoints para gestionar los tickets de soporte.
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Listar tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Lista de tickets obtenida correctamente.
 *       500:
 *         description: Error en el servidor.
 *   post:
 *     summary: Crear ticket
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
 *                 example: Alta
 *               descripcion:
 *                 type: string
 *                 example: El sistema no carga correctamente
 *     responses:
 *       201:
 *         description: Ticket creado correctamente.
 *       500:
 *         description: Error al crear el ticket.
 */

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   get:
 *     summary: Obtener ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del ticket.
 *       404:
 *         description: Ticket no encontrado.
 *   patch:
 *     summary: Actualizar ticket
 *     tags: [Tickets]
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
 *               estado:
 *                 type: string
 *                 example: Resuelto
 *               prioridad:
 *                 type: string
 *                 example: Media
 *     responses:
 *       200:
 *         description: Ticket actualizado correctamente.
 *       404:
 *         description: Ticket no encontrado.
 *   delete:
 *     summary: Cerrar ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket cerrado correctamente.
 *       404:
 *         description: Ticket no encontrado.
 */
