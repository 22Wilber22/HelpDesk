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

export default router;