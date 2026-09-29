import { pool } from './db.js';

export async function calculateMaterial(productTypeId, materialTypeId, quantity, param1, param2) {
  try {
    if (quantity <= 0 || param1 < 0 || param2 < 0) {
      return -1;
    }

    const product = await pool.query(
      'SELECT coefficient FROM product_types WHERE product_type_id = $1',
      [productTypeId],
    );
    const material = await pool.query(
      'SELECT defect_percent FROM material_types WHERE material_type_id = $1',
      [materialTypeId],
    );

    if (product.rows.length === 0 || material.rows.length === 0) {
      return -1;
    }

    const coefficient = Number(product.rows[0].coefficient);
    const defectPercent = Number(material.rows[0].defect_percent);

    const perUnit = param1 * param2 * coefficient;
    const netTotal = perUnit * quantity;
    const withDefect = netTotal * (1 + defectPercent / 100);

    return Math.ceil(withDefect);
  } catch {
    return -1;
  }
}
