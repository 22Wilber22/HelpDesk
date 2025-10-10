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
