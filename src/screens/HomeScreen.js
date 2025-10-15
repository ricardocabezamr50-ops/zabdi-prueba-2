import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import dayjs from 'dayjs';
import { useDb } from '../../data';      // usamos la DB directa
import Money from '../components/Money';

export default function HomeScreen(){
  const db = useDb();
  const [totales, setTotales] = useState({ ventas: 0, ganancia: 0 });

  useEffect(() => {
    (async () => {
      // Rango del mes actual en ISO
      const start = dayjs().startOf('month').toISOString();
      const end   = dayjs().endOf('month').toISOString();

      // SUM total y ganancia = (precio_unit - precio_compra) * cantidad
      const row = await db.getFirstAsync(
        `SELECT 
            COALESCE(SUM(v.total), 0) AS ventas,
            COALESCE(SUM( (v.precio_unit - p.precio_compra) * v.cantidad ), 0) AS ganancia
         FROM ventas v
         JOIN productos p ON p.id = v.producto_id
         WHERE v.fecha >= ? AND v.fecha <= ?`,
        [start, end]
      );
      setTotales({
        ventas: Number(row?.ventas ?? 0),
        ganancia: Number(row?.ganancia ?? 0),
      });
    })();
  }, [db]);

  const month = dayjs().format('MMMM YYYY');

  return (
    <View style={{ padding: 16 }}>
      <Card style={{ marginBottom: 12, borderRadius: 16, elevation: 2 }}>
        <Card.Title title={`Resumen ${month}`} />
        <Card.Content style={{ gap: 8 }}>
          <Text variant="titleMedium">Ventas del mes: <Money value={totales.ventas} /></Text>
          <Text variant="titleMedium">Ganancia del mes: <Money value={totales.ganancia} /></Text>
        </Card.Content>
      </Card>

      <Card style={{ borderRadius: 16 }}>
        <Card.Title title="Sugerencias" />
        <Card.Content>
          <Text style={{ opacity: 0.7 }}>
            • Cargá más productos en Inventario.{"\n"}
            • Usá “Vender” para registrar ventas con pago parcial y saldo.{"\n"}
            • Mirá tus estadísticas por día en la pestaña *Estadísticas*.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
