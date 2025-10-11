import express from 'express';
import {
  crearComentario,
  editarComentario,
  obtenerComentarios,
  obtenerComentariosPorTicket
} from '../Controllers/comentarios.controller.js';

const router = express.Router();

router.get('/', obtenerComentarios);
router.post('/', crearComentario);
router.get('/ticket/:ticket_id', obtenerComentariosPorTicket);
router.patch('/:comentarioId', editarComentario);

export default router;

/**
 * @swagger
 * tags:
 *   name: Comentarios
 *   description: Endpoints para gestionar comentarios de los tickets
 */

/**
 * @swagger
 * /comentarios:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comentarios]
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida correctamente
 *       500:
 *         description: Error al obtener los comentarios
 */

/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comentarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_id:
 *                 type: integer
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 example: 3
 *               texto:
 *                 type: string
 *                 example: "El problema fue revisado, pendiente respuesta del cliente."
 *     responses:
 *       201:
 *         description: Comentario creado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /comentarios/ticket/{ticket_id}:
 *   get:
 *     summary: Obtener todos los comentarios de un ticket específico
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ticket para el que se desean los comentarios
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida correctamente
 *       404:
 *         description: No se encontraron comentarios para el ticket
 *       500:
 *         description: Error al obtener los comentarios
 */

/**
 * @swagger
 * /comentarios/{comentarioId}:
 *   patch:
 *     summary: Editar un comentario existente
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: comentarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *                 example: "Comentario actualizado después de revisión del caso."
 *     responses:
 *       200:
 *         description: Comentario actualizado correctamente
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error al actualizar el comentario
 */
