import test from 'node:test';
import assert from 'node:assert/strict';
import { comparePassword } from '../config/jwt.js';

test('comparePassword returns false when hash is null or missing', async () => {
  assert.equal(await comparePassword('admin123', null), false);
  assert.equal(await comparePassword('admin123', undefined), false);
});
