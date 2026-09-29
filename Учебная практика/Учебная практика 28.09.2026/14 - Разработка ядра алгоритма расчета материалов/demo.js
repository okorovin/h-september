import { pool } from './db.js';
import { calculateMaterial } from './material-calc.js';

const cases = [
  ['корректный расчёт (тип 1, материал 1, 10 шт, 2.0 x 3.0)', [1, 1, 10, 2.0, 3.0]],
  ['корректный расчёт (тип 2, материал 2, 5 шт, 1.5 x 4.0)', [2, 2, 5, 1.5, 4.0]],
  ['количество = 0', [1, 1, 0, 2.0, 3.0]],
  ['отрицательный параметр', [1, 1, 10, -2.0, 3.0]],
  ['несуществующий тип продукции', [999, 1, 10, 2.0, 3.0]],
  ['несуществующий тип материала', [1, 999, 10, 2.0, 3.0]],
];

for (const [label, args] of cases) {
  const result = await calculateMaterial(...args);
  console.log(`${label}: ${result}`);
}

await pool.end();
