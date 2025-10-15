import { useDb } from './data';

export const useSales = () => {
  const db = useDb();

  /**
   * Guarda una venta, registra "pagado" y descuenta stock en transacción.
   * Si 'pagado' es null/undefined, se asume pago total.
   */
  const saveSale = async ({ productoId, cantidad, precioUnit, pagado, fecha }) => {
    const qty = Number(cantidad);
    const unit = Number(precioUnit);
    const total = qty * unit;
    let paid = pagado == null ? total : Math.max(0, Math.min(Number(pagado), total));
    const when = (fecha && String(fecha).trim()) || new Date().toISOString();

    if (!productoId || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(unit) || unit <= 0) {
      throw new Error('Datos inválidos: revisá producto, cantidad y precio.');
    }

    await db.execAsync('BEGIN IMMEDIATE;');
    try {
      const row = await db.getFirstAsync(`SELECT stock FROM productos WHERE id = ?`, [productoId]);
      const stockActual = Number(row?.stock ?? 0);
      if (stockActual < qty) {
        throw new Error(`Stock insuficiente. Actual: ${stockActual}`);
      }

      const ins = await db.runAsync(
        `INSERT INTO ventas (producto_id, cantidad, precio_unit, total, pagado, fecha)
         VALUES (?,?,?,?,?,?)`,
        [productoId, qty, unit, total, paid, when]
      );

      const upd = await db.runAsync(
        `UPDATE productos SET stock = stock - ? WHERE id = ?`,
        [qty, productoId]
      );
      if ((upd?.changes ?? 0) === 0) throw new Error('No se pudo actualizar el stock.');

      await db.execAsync('COMMIT;');
      return { ventaId: ins?.lastInsertRowId, total, pagado: paid };
    } catch (e) {
      await db.execAsync('ROLLBACK;');
      throw e;
    }
  };

  const listSales = async ({ fromISO, toISO } = {}) => {
    if (fromISO && toISO) {
      return db.getAllAsync(
        `SELECT v.*, p.nombre, p.talle
         FROM ventas v
         JOIN productos p ON p.id = v.producto_id
         WHERE v.fecha >= ? AND v.fecha < ?
         ORDER BY v.id DESC`,
        [fromISO, toISO]
      );
    }
    return db.getAllAsync(
      `SELECT v.*, p.nombre, p.talle
       FROM ventas v
       JOIN productos p ON p.id = v.producto_id
       ORDER BY v.id DESC`
    );
  };

  return { saveSale, listSales };
};
