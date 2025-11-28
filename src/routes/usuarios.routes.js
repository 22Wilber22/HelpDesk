import { Router } from "express";
import { getUser, getUserById, postUser, deleteUser, patchUser } from "../Controllers/usuarios.controller.js";
import { authenticateToken, requireRole } from "../../config/jwt.js";

const router = Router();

// Aplicar autenticación a todas las rutas de usuarios
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar los usuarios (agentes, supervisores y administradores).
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *       401:
 *         description: No autorizado - Token requerido.
 *       403:
 *         description: Prohibido - Rol insuficiente.
 *       500:
 *         description: Error del servidor.
 *   post:
 *     summary: Crear usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_completo:
 *                 type: string
 *                 example: María Pérez
 *               correo:
 *                 type: string
 *                 example: maria.perez@empresa.com
 *               telefono:
 *                 type: string
 *                 example: 7012-3456
 *               rol:
 *                 type: string
 *                 enum: [Admin, Supervisor, Agente]
 *                 example: Agente
 *               password:
 *                 type: string
 *                 example: ClaveSegura123
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *       401:
 *         description: No autorizado - Token requerido.
 *       403:
 *         description: Prohibido - Rol insuficiente.
 *       500:
 *         description: Error del servidor.
 */
router.get("/", requireRole(['Admin', 'Supervisor', 'Agente']), getUser);
router.post("/", requireRole(['Admin']), postUser);

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Información del usuario.
 *       401:
 *         description: No autorizado - Token requerido.
 *       404:
 *         description: Usuario no encontrado.
 *   patch:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_completo:
 *                 type: string
 *                 example: María Pérez Updated
 *               correo:
 *                 type: string
 *                 example: maria.updated@empresa.com
 *               telefono:
 *                 type: string
 *                 example: 7013-7788
 *               rol:
 *                 type: string
 *                 enum: [Admin, Supervisor, Agente]
 *                 example: Supervisor
 *               password:
 *                 type: string
 *                 example: NuevaClaveSegura
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo]
 *                 example: activo
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       401:
 *         description: No autorizado - Token requerido.
 *       403:
 *         description: Prohibido - Rol insuficiente.
 *       404:
 *         description: Usuario no encontrado.
 *   delete:
 *     summary: Desactivar usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente.
 *       401:
 *         description: No autorizado - Token requerido.
 *       403:
 *         description: Prohibido - Rol insuficiente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete("/:usuario_id", requireRole(['Admin']), deleteUser);
router.patch("/:usuario_id", requireRole(['Admin']), patchUser);
router.get("/:usuario_id", requireRole(['Admin', 'Supervisor', 'Agente']), getUserById);

export default router;