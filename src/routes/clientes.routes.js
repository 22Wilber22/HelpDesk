import express from 'express';
import { getClientes, getClienteById, postCliente, patchCliente, deleteCliente } from '../Controllers/clientes.controller.js';
import { authenticateToken, requireRole } from "../../config/jwt.js";

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', requireRole(['Admin', 'Supervisor', 'Agente']), getClientes);

/**
 * @swagger
 * /clientes/{cliente_id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 */
router.get('/:cliente_id', requireRole(['Admin', 'Supervisor', 'Agente']), getClienteById);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear nuevo cliente
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               empresa:
 *                 type: string
 *               area:
 *                 type: string
 *               direccion:
 *                 type: string
 *               notas:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 */
router.post('/', requireRole(['Admin', 'Supervisor', 'Agente']), postCliente);

/**
 * @swagger
 * /clientes/{cliente_id}:
 *   patch:
 *     summary: Actualizar cliente
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cliente_id
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
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               empresa:
 *                 type: string
 *               area:
 *                 type: string
 *               direccion:
 *                 type: string
 *               notas:
 *                 type: string
 *               activo:
 *                 type: boolean
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 */
router.patch('/:cliente_id', requireRole(['Admin', 'Supervisor', 'Agente']), patchCliente);

/**
 * @swagger
 * /clientes/{cliente_id}:
 *   delete:
 *     summary: Desactivar cliente
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente desactivado
 */
router.delete('/:cliente_id', requireRole(['Admin']), deleteCliente);

export default router;