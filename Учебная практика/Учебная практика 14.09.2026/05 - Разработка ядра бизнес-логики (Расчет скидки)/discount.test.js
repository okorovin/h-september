import test from 'node:test';
import assert from 'node:assert';
import { calculatePartnerDiscount } from './discount.js';

// пограничные значения из ТЗ
test('9999 -> 0%', () => {
  assert.strictEqual(calculatePartnerDiscount(9999), 0);
});

test('10000 -> 5%', () => {
  assert.strictEqual(calculatePartnerDiscount(10000), 5);
});

test('49999 -> 5%', () => {
  assert.strictEqual(calculatePartnerDiscount(49999), 5);
});

test('50000 -> 10%', () => {
  assert.strictEqual(calculatePartnerDiscount(50000), 10);
});

test('300000 -> 15%', () => {
  assert.strictEqual(calculatePartnerDiscount(300000), 15);
});
