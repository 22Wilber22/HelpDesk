import test from 'node:test';
import assert from 'node:assert/strict';
import { comparePassword } from '../config/jwt.js';
import { resolveClienteIdForTicketCreation } from '../src/Controllers/ticket.controllers.js';

test('comparePassword returns false when hash is null or missing', async () => {
  assert.equal(await comparePassword('admin123', null), false);
  assert.equal(await comparePassword('admin123', undefined), false);
});

test('resolveClienteIdForTicketCreation auto-selects the only client available', () => {
  const id = resolveClienteIdForTicketCreation({
    rol: 'Admin',
    cliente_id: undefined,
    clientes: [{ cliente_id: 7 }],
  });

  assert.equal(id, 7);
});
