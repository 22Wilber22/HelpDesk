import { Router } from "express";
import { getCategorias } from "../Controllers/categorias.controller.js";
import { authenticateToken } from "../../config/jwt.js";

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Endpoints para gestionar las categorías de tickets.
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categorias]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente.
 *       401:
 *         description: No autorizado - Token requerido.
 *       500:
 *         description: Error del servidor.
 */
router.get("/", getCategorias);

export default router;
