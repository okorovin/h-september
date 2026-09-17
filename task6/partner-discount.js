import { pool } from './db.js';
import { calculatePartnerDiscount } from './discount.js';

export async function getPartnerWithDiscount(partnerId) {
  const sql = `
    SELECT p.partner_id, p.company_name, COALESCE(SUM(s.quantity), 0) AS total_quantity
    FROM partners p
    LEFT JOIN sales_history s ON s.partner_id = p.partner_id
    WHERE p.partner_id = $1
    GROUP BY p.partner_id, p.company_name`;

  const { rows } = await pool.query(sql, [partnerId]);
  if (rows.length === 0) {
    return null;
  }

  const partner = rows[0];
  const totalQuantity = Number(partner.total_quantity);

  return {
    partner_id: partner.partner_id,
    company_name: partner.company_name,
    total_quantity: totalQuantity,
    discount: calculatePartnerDiscount(totalQuantity),
  };
}
