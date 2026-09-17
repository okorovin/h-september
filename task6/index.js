import { writeFile } from 'node:fs/promises';
import { pool } from './db.js';
import { getPartnerWithDiscount } from './partner-discount.js';

const partners = [];
for (const id of [1, 2, 3]) {
  const partner = await getPartnerWithDiscount(id);
  partners.push(partner);
}

const json = JSON.stringify(partners, null, 2);
console.log(json);
await writeFile('result.json', json + '\n');

await pool.end();
