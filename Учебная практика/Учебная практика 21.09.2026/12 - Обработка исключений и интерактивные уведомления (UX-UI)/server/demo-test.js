import assert from 'node:assert';
import { pool } from './db.js';
import { getAllPartnersWithDiscount } from './partner-service.js';

const partners = await getAllPartnersWithDiscount();
console.log('Партнёры из БД:');
for (const partner of partners) {
  console.log(`  ${partner.company_name} — объём ${partner.total_quantity}, скидка ${partner.discount}%`);
}

await pool.query(`
  INSERT INTO partners (partner_id, company_name, inn, contact_email)
  VALUES ((SELECT MAX(partner_id) + 1 FROM partners), 'ООО "Без продаж"', '0000000000', 'nosales@test.ru')
`);

const check = await getAllPartnersWithDiscount();
const noSales = check.find((partner) => partner.company_name === 'ООО "Без продаж"');
assert.strictEqual(noSales.total_quantity, 0);
assert.strictEqual(noSales.discount, 0);
console.log('\nOK: партнёр без продаж -> объём 0, скидка 0% (ошибок нет)');

await pool.query(`DELETE FROM partners WHERE company_name = 'ООО "Без продаж"'`);
await pool.end();
