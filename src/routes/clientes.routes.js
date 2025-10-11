import express from 'express';
import {
  getClientes,
  getClienteById,
  postCliente,
  patchCliente,
  deleteCliente
} from '../Controllers/clientes.controller.js';

const router = express.Router();

// Controladores (debes implementarlos en otro archivo)

// Obtener todos los clientes
router.get('/', getClientes);

// Obtener un cliente por ID
router.get('/:cliente_id', getClienteById);

// Crear un nuevo cliente
router.post('/', postCliente);

// Actualizar un cliente por ID
router.patch('/:cliente_id', patchCliente);

// Eliminar un cliente por ID
router.delete('/:cliente_id', deleteCliente);

export default router;/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para gestionar los clientes del sistema
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes activos
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida correctamente
 *       500:
 *         description: Error al obtener los clientes
 */

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del cliente
 *       404:
 *         description: Cliente no encontrado
 */

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Registrar un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Carlos Méndez"
 *               correo:
 *                 type: string
 *                 example: "carlos.mendez@empresa.com"
 *               telefono:
 *                 type: string
 *                 example: "7011-2234"
 *               empresa:
 *                 type: string
 *                 example: "UControl"
 *               area:
 *                 type: string
 *                 example: "Soporte Técnico"
 *               direccion:
 *                 type: string
 *                 example: "Oficina Central"
 *               notas:
 *                 type: string
 *                 example: "Cliente interno registrado"
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /clientes/{id}:
 *   patch:
 *     summary: Actualizar información de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telefono:
 *                 type: string
 *                 example: "7011-9999"
 *               area:
 *                 type: string
 *                 example: "Ventas"
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *       404:
 *         description: Cliente no encontrado
 */

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Desactivar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente desactivado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
