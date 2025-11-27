import express from 'express';
import { login, verifyAuth, changePassword, registerCliente } from '../Controllers/authcontroller.controller.js';
import { authenticateToken } from '../../config/jwt.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo cliente
 *     tags: [Autenticación]
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
 *               password:
 *                 type: string
 *               empresa:
 *                 type: string
 *               area:
 *                 type: string
 *               direccion:
 *                 type: string
 *               notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente registrado
 */
router.post('/register', registerCliente);

// ... las demás rutas de auth permanecen igual
router.post('/login', login);
router.get('/verify', authenticateToken, verifyAuth);
router.post('/change-password', authenticateToken, changePassword);

export default router;