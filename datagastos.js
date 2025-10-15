import { useDb } from './data';

export const useExpenses = () => {
  const db = useDb();

  const saveExpense = async (g) => {
    const descripcion = String(g?.descripcion ?? '').trim();
    const monto = Number(g?.monto);
    const fecha = (g?.fecha && String(g.fecha).trim()) || new Date().toISOString();

    if (!descripcion || !Number.isFinite(monto) || monto <= 0) {
      throw new Error('Datos inválidos: revisá descripción y monto.');
    }

    const res = await db.runAsync(
      `INSERT INTO gastos (descripcion, monto, fecha) VALUES (?,?,?)`,
      [descripcion, monto, fecha]
    );
    return { lastInsertRowId: res?.lastInsertRowId, changes: res?.changes };
  };

  const listExpenses = async () => {
    return db.getAllAsync(`SELECT * FROM gastos ORDER BY id DESC`);
  };

  return { saveExpense, listExpenses };
};
