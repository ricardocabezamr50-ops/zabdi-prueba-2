import { useSQLiteContext } from 'expo-sqlite';

// Se ejecuta desde <SQLiteProvider onInit={initDb}>
export const initDb = async (db) => {
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS productos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      talle INTEGER,
      precio_compra REAL NOT NULL,
      precio_venta REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gastos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ventas(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unit REAL NOT NULL,
      total REAL NOT NULL,
      fecha TEXT DEFAULT (datetime('now')),
      pagado REAL, -- monto efectivamente cobrado (puede ser null)
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    );

    -- Pasivos (préstamos) y sus pagos
    CREATE TABLE IF NOT EXISTS pasivos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT NOT NULL,
      monto_total REAL NOT NULL,
      saldo_pendiente REAL NOT NULL,
      fecha TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS pasivo_pagos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pasivo_id INTEGER NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (pasivo_id) REFERENCES pasivos(id)
    );

    -- NUEVO: clientas (para por cobrar)
    CREATE TABLE IF NOT EXISTS clientas(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      saldo REAL NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
    CREATE INDEX IF NOT EXISTS idx_ventas_producto ON ventas(producto_id);
    CREATE INDEX IF NOT EXISTS idx_pasivos_fecha ON pasivos(fecha);
    CREATE INDEX IF NOT EXISTS idx_clientas_nombre ON clientas(nombre);
  `);

  // Migración defensiva: por si tu 'ventas' no tenía 'pagado'
  try { await db.execAsync(`ALTER TABLE ventas ADD COLUMN pagado REAL`); } catch (_) {}
};

export const useDb = () => useSQLiteContext();
