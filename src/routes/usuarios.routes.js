import { Router } from "express";
import { getUser, getUserById, postUser, deleteUser, patchUser } from "../Controllers/usuarios.controller.js";

const router = Router();

router.get("/", getUser);
router.post("/", postUser);
router.delete("/:usuario_id", deleteUser);
router.patch("/:usuario_id", patchUser);
router.get("/:usuario_id", getUserById);

export default router;




/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios del sistema (agentes, supervisores, etc.)
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del usuario
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_completo:
 *                 type: string
 *                 example: "María Pérez"
 *               correo:
 *                 type: string
 *                 example: "maria.perez@empresa.com"
 *               telefono:
 *                 type: string
 *                 example: "7012-3456"
 *               rol:
 *                 type: string
 *                 example: "Agente"
 *               password:
 *                 type: string
 *                 example: "ClaveSegura123"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   patch:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
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
 *                 example: "7013-7788"
 *               rol:
 *                 type: string
 *                 example: "Supervisor"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   delete:
 *     summary: Desactivar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *       404:
 *         description: Usuario no encontrado
 */

