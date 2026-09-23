import { pool } from './db.js';
import { calculatePartnerDiscount } from './discount.js';

export async function getPartnerTypes() {
  const { rows } = await pool.query('SELECT partner_type_id, name FROM partner_types ORDER BY partner_type_id');
  return rows;
}

export async function getAllPartnersWithDiscount() {
  const sql = `
    SELECT p.partner_id, p.company_name, t.name AS partner_type,
           p.director_name, p.address, p.contact_email, p.phone, p.rating,
           COALESCE(SUM(s.quantity), 0) AS total_quantity
    FROM partners p
    LEFT JOIN partner_types t ON t.partner_type_id = p.partner_type_id
    LEFT JOIN sales_history s ON s.partner_id = p.partner_id
    GROUP BY p.partner_id, p.company_name, t.name, p.director_name, p.address,
             p.contact_email, p.phone, p.rating
    ORDER BY p.company_name`;

  const { rows } = await pool.query(sql);

  return rows.map((row) => {
    const totalQuantity = Number(row.total_quantity);
    return {
      partner_id: row.partner_id,
      company_name: row.company_name,
      partner_type: row.partner_type,
      director_name: row.director_name,
      address: row.address,
      email: row.contact_email,
      phone: row.phone,
      rating: row.rating,
      total_quantity: totalQuantity,
      discount: calculatePartnerDiscount(totalQuantity),
    };
  });
}

export async function getPartnerById(partnerId) {
  const sql = `
    SELECT partner_id, company_name, partner_type_id, director_name,
           address, contact_email, phone, rating
    FROM partners
    WHERE partner_id = $1`;

  const { rows } = await pool.query(sql, [partnerId]);
  return rows[0] || null;
}

async function assertTypeExists(partnerTypeId) {
  if (partnerTypeId === null || partnerTypeId === undefined) {
    return;
  }
  const { rows } = await pool.query('SELECT 1 FROM partner_types WHERE partner_type_id = $1', [partnerTypeId]);
  if (rows.length === 0) {
    throw new Error('Указан несуществующий тип партнёра');
  }
}

export async function createPartner(data) {
  await assertTypeExists(data.partner_type_id);

  const sql = `
    INSERT INTO partners (company_name, partner_type_id, director_name, address, contact_email, phone, rating)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING partner_id`;

  const values = [
    data.company_name,
    data.partner_type_id ?? null,
    data.director_name ?? null,
    data.address ?? null,
    data.contact_email,
    data.phone ?? null,
    data.rating ?? null,
  ];

  const { rows } = await pool.query(sql, values);
  return rows[0].partner_id;
}

export async function updatePartner(partnerId, data) {
  const existing = await getPartnerById(partnerId);
  if (existing === null) {
    throw new Error('Партнёр не найден');
  }
  await assertTypeExists(data.partner_type_id);

  const sql = `
    UPDATE partners
    SET company_name = $1, partner_type_id = $2, director_name = $3, address = $4,
        contact_email = $5, phone = $6, rating = $7
    WHERE partner_id = $8`;

  const values = [
    data.company_name,
    data.partner_type_id ?? null,
    data.director_name ?? null,
    data.address ?? null,
    data.contact_email,
    data.phone ?? null,
    data.rating ?? null,
    partnerId,
  ];

  await pool.query(sql, values);
}
