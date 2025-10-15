import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text, Button, Chip, Divider } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useDb } from '../../data';
import Money from '../components/Money';

export default function DashboardScreen() {
  const db = useDb();
  const nav = useNavigation();

  const [ventasMes, setVentasMes] = useState(0);
  const [gananciaMes, setGananciaMes] = useState(0);
  const [ticketProm, setTicketProm] = useState(0);
  const [numVentas, setNumVentas] = useState(0);

  const [cajaDisponible, setCajaDisponible] = useState(0);
  const [deudasPasivos, setDeudasPasivos] = useState(0);
  const [porCobrarClientes, setPorCobrarClientes] = useState(0);
  const [top, setTop] = useState([]);

  const calc = useCallback(async ()=>{
    const start = dayjs().startOf('month').toISOString();
    const end   = dayjs().endOf('month').toISOString();

    const tot = await db.getFirstAsync(
      `SELECT 
         COALESCE(SUM(v.total), 0) AS ventas,
         COALESCE(SUM((v.precio_unit - p.precio_compra) * v.cantidad), 0) AS ganancia,
         COUNT(*) AS n
       FROM ventas v 
       JOIN productos p ON p.id = v.producto_id
       WHERE v.fecha >= ? AND v.fecha <= ?`,
      [start, end]
    );
    const ventas = Number(tot?.ventas ?? 0);
    const n = Number(tot?.n ?? 0);
    setVentasMes(ventas);
    setGananciaMes(Number(tot?.ganancia ?? 0));
    setNumVentas(n);
    setTicketProm(n > 0 ? ventas / n : 0);

    const rIngresos = await db.getFirstAsync(`SELECT COALESCE(SUM(COALESCE(pagado, total)),0) AS t FROM ventas`);
    const rGastos   = await db.getFirstAsync(`SELECT COALESCE(SUM(monto),0) AS t FROM gastos`);
    const rPPagos   = await db.getFirstAsync(`SELECT COALESCE(SUM(monto),0) AS t FROM pasivo_pagos`);
    setCajaDisponible(Number(rIngresos?.t ?? 0) - Number(rGastos?.t ?? 0) - Number(rPPagos?.t ?? 0));

    const rPas = await db.getFirstAsync(`SELECT COALESCE(SUM(saldo_pendiente),0) AS t FROM pasivos`);
    setDeudasPasivos(Number(rPas?.t ?? 0));

    const rCli = await db.getFirstAsync(`SELECT COALESCE(SUM(saldo),0) AS t FROM clientas`);
    setPorCobrarClientes(Number(rCli?.t ?? 0));

    const tTop = await db.getAllAsync(
      `SELECT p.nombre, SUM(v.cantidad) AS qty, SUM(v.total) AS total
       FROM ventas v 
       JOIN productos p ON p.id = v.producto_id
       WHERE v.fecha >= ? AND v.fecha <= ?
       GROUP BY v.producto_id
       ORDER BY total DESC
       LIMIT 3`,
      [start, end]
    );
    setTop(tTop.map(r => ({ nombre: r.nombre, qty: Number(r.qty||0), total: Number(r.total||0) })));
  }, [db]);

  useFocusEffect(useCallback(() => { calc(); }, [calc]));
  useEffect(() => { calc(); }, [calc]);

  const month = dayjs().format('MMMM YYYY');

  return (
    <ScrollView contentContainerStyle={{ padding: 12, backgroundColor: '#f6f7fb' }}>
      <Card style={styles.card}>
        <Card.Title title={`Resumen del mes · ${month}`} />
        <Card.Content style={{ gap: 8 }}>
          <Text variant="titleMedium">Caja disponible: <Money value={cajaDisponible} /></Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Chip icon="cash-remove" style={styles.chip}>Deudas (pasivos): <Money value={deudasPasivos} /></Chip>
            <Chip icon="account-cash-outline" style={styles.chip}>Por cobrar (clientes): <Money value={porCobrarClientes} /></Chip>
          </View>
        </Card.Content>
      </Card>

      <View style={{ height: 8 }} />
      <Card style={styles.card}>
        <Card.Title title="Ventas" />
        <Card.Content style={{ gap: 8 }}>
          <Text>Ventas del mes: <Money value={ventasMes} /></Text>
          <Text>Ganancia del mes: <Money value={gananciaMes} /></Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
            <Chip icon="ticket-confirmation-outline" style={styles.chip}>Ticket prom.: <Money value={ticketProm} /></Chip>
            <Chip icon="shopping-outline" style={styles.chip}>Nº ventas: {numVentas}</Chip>
          </View>
        </Card.Content>
      </Card>

      <View style={{ height: 8 }} />
      <Card style={[styles.card, { marginBottom: 16 }]}>
        <Card.Title title="Top productos del mes" />
        <Card.Content>
          {top.length === 0 && <Text style={{ opacity: 0.6 }}>Sin ventas aún este mes.</Text>}
          {top.map((t, idx) => (
            <View key={idx} style={{ paddingVertical: 6 }}>
              <Text style={{ fontWeight: '600' }}>{idx + 1}. {t.nombre} — {t.qty} u.</Text>
              <Text style={{ opacity: 0.7 }}>Facturación: <Money value={t.total} /></Text>
              {idx < top.length - 1 && <Divider style={{ marginTop: 6 }} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { marginBottom: 16 }]}>
        <Card.Title title="Acciones rápidas" />
        <Card.Content style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Button mode="contained" icon="cube-send" onPress={() => nav.navigate('Inventario')}>Agregar producto</Button>
          <Button mode="contained" icon="cart" onPress={() => nav.navigate('Vender')}>Registrar venta</Button>
          <Button mode="contained" icon="cash-plus" onPress={() => nav.navigate('Gastos')}>Agregar gasto</Button>
          <Button mode="contained" icon="wallet" onPress={() => nav.navigate('Pasivos')}>Nuevo pasivo</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = {
  card: { borderRadius: 16, backgroundColor: '#f4f2ff', elevation: 2 },
  chip: { backgroundColor: '#eef2ff' },
};
