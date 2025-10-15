import { useDb } from './data';

export const useProducts = () => {
  const db = useDb();

  const saveProduct = async (p) => {
    // Normalizamos y validamos por si algo raro llega desde el form
    const nombre = String(p?.nombre ?? '').trim();
    const talle = p?.talle === '' || p?.talle == null ? null : Number(p.talle);
    const precioCompra = Number(p?.precioCompra);
    const precioVenta  = Number(p?.precioVenta);
    const stock = p?.stock === '' || p?.stock == null ? 0 : Number(p.stock);

    if (!nombre || !Number.isFinite(precioCompra) || !Number.isFinite(precioVenta)) {
      throw new Error('Datos inválidos: revisá nombre y precios.');
    }

    const res = await db.runAsync(
      `INSERT INTO productos (nombre, talle, precio_compra, precio_venta, stock)
       VALUES (?,?,?,?,?)`,
      [nombre, talle, precioCompra, precioVenta, stock]
    );

    // Devuelvo info útil para debug
    return { lastInsertRowId: res?.lastInsertRowId, changes: res?.changes };
  };

  const listProducts = async () => {
    return db.getAllAsync(`SELECT * FROM productos ORDER BY id DESC`);
  };

  return { saveProduct, listProducts };
};
