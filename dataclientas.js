import { useDb } from './data';

export const useClientas = () => {
  const db = useDb();

  const listClientas = async () => {
    return db.getAllAsync(`SELECT * FROM clientas ORDER BY saldo DESC, nombre ASC`);
  };

  const upsertSaldo = async ({ nombre, delta }) => {
    const n = String(nombre || '').trim();
    if (!n) throw new Error('Nombre inválido');

    await db.execAsync('BEGIN IMMEDIATE;');
    try {
      const row = await db.getFirstAsync(`SELECT id, saldo FROM clientas WHERE LOWER(nombre)=LOWER(?)`, [n]);
      if (row?.id) {
        await db.runAsync(`UPDATE clientas SET saldo = saldo + ? WHERE id = ?`, [Number(delta) || 0, row.id]);
      } else {
        await db.runAsync(`INSERT INTO clientas (nombre, saldo) VALUES (?, ?)`, [n, Number(delta) || 0]);
      }
      await db.execAsync('COMMIT;');
    } catch (e) {
      await db.execAsync('ROLLBACK;'); throw e;
    }
  };

  const setSaldoCero = async (id) => {
    await db.runAsync(`UPDATE clientas SET saldo = 0 WHERE id = ?`, [id]);
  };

  const totalPorCobrar = async () => {
    const r = await db.getFirstAsync(`SELECT COALESCE(SUM(saldo),0) AS t FROM clientas`);
    return Number(r?.t ?? 0);
  };

  return { listClientas, upsertSaldo, setSaldoCero, totalPorCobrar };
};
