import { useDb } from './data';

export const usePasivos = () => {
  const db = useDb();

  const addPasivo = async ({ descripcion, monto, fecha }) => {
    const total = Number(monto);
    if (!descripcion || !Number.isFinite(total) || total <= 0) {
      throw new Error('Completa descripción y monto > 0');
    }
    const when = (fecha && String(fecha).trim()) || new Date().toISOString();
    const ins = await db.runAsync(
      `INSERT INTO pasivos (descripcion, monto_total, saldo_pendiente, fecha)
       VALUES (?, ?, ?, ?)`,
      [descripcion.trim(), total, total, when]
    );
    return ins?.lastInsertRowId;
  };

  const listPasivos = async () => {
    return db.getAllAsync(
      `SELECT * FROM pasivos ORDER BY id DESC`
    );
  };

  const pagarPasivo = async ({ pasivoId, monto, fecha }) => {
    const pay = Number(monto);
    if (!pasivoId || !Number.isFinite(pay) || pay <= 0) {
      throw new Error('Monto de pago inválido');
    }
    const when = (fecha && String(fecha).trim()) || new Date().toISOString();

    await db.execAsync('BEGIN IMMEDIATE;');
    try {
      const p = await db.getFirstAsync(`SELECT saldo_pendiente FROM pasivos WHERE id = ?`, [pasivoId]);
      const saldo = Number(p?.saldo_pendiente ?? 0);
      if (saldo <= 0) throw new Error('Este pasivo ya está cancelado.');
      if (pay > saldo) throw new Error(`El pago excede el saldo ($${saldo.toFixed(2)})`);

      await db.runAsync(
        `INSERT INTO pasivo_pagos (pasivo_id, monto, fecha) VALUES (?,?,?)`,
        [pasivoId, pay, when]
      );
      const upd = await db.runAsync(
        `UPDATE pasivos SET saldo_pendiente = saldo_pendiente - ? WHERE id = ?`,
        [pay, pasivoId]
      );
      if ((upd?.changes ?? 0) === 0) throw new Error('No se pudo actualizar el saldo.');

      await db.execAsync('COMMIT;');
    } catch (e) {
      await db.execAsync('ROLLBACK;');
      throw e;
    }
  };

  const totalPasivosPendientes = async () => {
    const r = await db.getFirstAsync(`SELECT COALESCE(SUM(saldo_pendiente),0) AS t FROM pasivos`);
    return Number(r?.t ?? 0);
  };

  const totalPagosPasivos = async () => {
    const r = await db.getFirstAsync(`SELECT COALESCE(SUM(monto),0) AS t FROM pasivo_pagos`);
    return Number(r?.t ?? 0);
  };

  return { addPasivo, listPasivos, pagarPasivo, totalPasivosPendientes, totalPagosPasivos };
};
