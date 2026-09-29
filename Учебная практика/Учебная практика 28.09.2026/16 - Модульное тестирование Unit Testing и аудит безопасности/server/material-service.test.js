import test, { after } from 'node:test';
import assert from 'node:assert';
import { calculateMaterial } from './material-service.js';
import { pool } from './db.js';

after(() => pool.end());

test('стандартный расчёт: тип 1, материал 1, 10 шт, 2.0 x 3.0 -> 91', async () => {
  const result = await calculateMaterial(1, 1, 10, 2.0, 3.0);
  assert.strictEqual(result, 91);
});

test('округление вверх: 1.5075 округляется до 2', async () => {
  const result = await calculateMaterial(1, 1, 1, 1.0, 1.0);
  assert.strictEqual(result, 2);
});

test('несуществующий тип продукции -> -1', async () => {
  const result = await calculateMaterial(999, 1, 10, 2.0, 3.0);
  assert.strictEqual(result, -1);
});

test('несуществующий тип материала -> -1', async () => {
  const result = await calculateMaterial(1, 999, 10, 2.0, 3.0);
  assert.strictEqual(result, -1);
});

test('отрицательный параметр -> -1', async () => {
  const byParam1 = await calculateMaterial(1, 1, 10, -2.0, 3.0);
  const byParam2 = await calculateMaterial(1, 1, 10, 2.0, -3.0);
  assert.strictEqual(byParam1, -1);
  assert.strictEqual(byParam2, -1);
});

test('нулевое или отрицательное количество -> -1', async () => {
  const zero = await calculateMaterial(1, 1, 0, 2.0, 3.0);
  const negative = await calculateMaterial(1, 1, -5, 2.0, 3.0);
  assert.strictEqual(zero, -1);
  assert.strictEqual(negative, -1);
});
