import { pool } from './db.js';
import { logError } from './logger.js';

export async function getProductTypes() {
  const { rows } = await pool.query('SELECT product_type_id, name FROM product_types ORDER BY product_type_id');
  return rows;
}

export async function getMaterialTypes() {
  const { rows } = await pool.query('SELECT material_type_id, name FROM material_types ORDER BY material_type_id');
  return rows;
}

export async function calculateMaterial(productTypeId, materialTypeId, quantity, param1, param2) {
  try {
    // некорректный ввод: расчёт невозможен, возвращаем -1 вместо исключения
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

    // несуществующий тип продукции или материала
    if (product.rows.length === 0 || material.rows.length === 0) {
      return -1;
    }

    const coefficient = Number(product.rows[0].coefficient);
    const defectPercent = Number(material.rows[0].defect_percent);

    const perUnit = param1 * param2 * coefficient;
    const netTotal = perUnit * quantity;
    // добавляем процент брака и округляем вверх — нельзя закупить меньше целой единицы сырья
    const withDefect = netTotal * (1 + defectPercent / 100);

    return Math.ceil(withDefect);
  } catch (err) {
    logError(`Сбой расчёта материала: ${err.message}`);
    return -1;
  }
}
