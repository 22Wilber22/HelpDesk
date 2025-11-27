import express from 'express';
import { obtenerComentarios, crearComentario, obtenerComentariosPorTicket, editarComentario } from '../Controllers/comentarios.controller.js';
import { authenticateToken, requireRole } from '../config/jwt.js';

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @swagger
 * /comentarios:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentarios
 */
router.get('/', requireRole(['Admin', 'Supervisor']), obtenerComentarios);

/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Crear nuevo comentario
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_id:
 *                 type: integer
 *               usuario_id:
 *                 type: integer
 *               texto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado
 */
router.post('/', requireRole(['Admin', 'Supervisor', 'Agente']), crearComentario);

/**
 * @swagger
 * /comentarios/ticket/{ticket_id}:
 *   get:
 *     summary: Obtener comentarios por ticket
 *     tags: [Comentarios]
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
 *         description: Comentarios del ticket
 */
router.get('/ticket/:ticket_id', requireRole(['Admin', 'Supervisor', 'Agente']), obtenerComentariosPorTicket);

/**
 * @swagger
 * /comentarios/{comentarioId}:
 *   patch:
 *     summary: Editar comentario
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comentarioId
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
 *               texto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario actualizado
 */
router.patch('/:comentarioId', requireRole(['Admin', 'Supervisor', 'Agente']), editarComentario);

export default router;