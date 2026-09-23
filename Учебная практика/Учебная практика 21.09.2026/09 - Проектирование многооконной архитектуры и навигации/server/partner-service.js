import { pool } from './db.js';
import { calculatePartnerDiscount } from './discount.js';

export async function getAllPartnersWithDiscount() {
  const sql = `
    SELECT p.partner_id, p.company_name, p.contact_email, p.phone, p.rating,
           COALESCE(SUM(s.quantity), 0) AS total_quantity
    FROM partners p
    LEFT JOIN sales_history s ON s.partner_id = p.partner_id
    GROUP BY p.partner_id, p.company_name, p.contact_email, p.phone, p.rating
    ORDER BY p.company_name`;

  const { rows } = await pool.query(sql);

  return rows.map((row) => {
    const totalQuantity = Number(row.total_quantity);
    return {
      partner_id: row.partner_id,
      company_name: row.company_name,
      email: row.contact_email,
      phone: row.phone,
      rating: row.rating,
      total_quantity: totalQuantity,
      discount: calculatePartnerDiscount(totalQuantity),
    };
  });
}
