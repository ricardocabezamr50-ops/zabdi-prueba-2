import React, { useEffect, useState } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import dayjs from 'dayjs';
import { BarChart } from 'react-native-chart-kit';
import { useDb } from '../../data';
import Money from '../components/Money';

export default function StatsScreen(){
  const db = useDb();
  const [totalMes, setTotalMes] = useState(0);
  const [gananciaMes, setGananciaMes] = useState(0);
  const [labels, setLabels] = useState([]);
  const [serie, setSerie] = useState([]);

  useEffect(() => {
    (async () => {
      const start = dayjs().startOf('month').toISOString();
      const end   = dayjs().endOf('month').toISOString();

      // Totales de todo el mes
      const tot = await db.getFirstAsync(
        `SELECT 
            COALESCE(SUM(v.total), 0) AS ventas,
            COALESCE(SUM( (v.precio_unit - p.precio_compra) * v.cantidad ), 0) AS ganancia
         FROM ventas v
         JOIN productos p ON p.id = v.producto_id
         WHERE v.fecha >= ? AND v.fecha <= ?`,
        [start, end]
      );
      setTotalMes(Number(tot?.ventas ?? 0));
      setGananciaMes(Number(tot?.ganancia ?? 0));

      // Por dÃ­a del mes (group by substr(fecha,1,10))
      const rows = await db.getAllAsync(
        `SELECT substr(v.fecha,1,10) AS dia, SUM(v.total) AS total
         FROM ventas v
         WHERE v.fecha >= ? AND v.fecha <= ?
         GROUP BY substr(v.fecha,1,10)
         ORDER BY dia ASC`,
        [start, end]
      );

      const daysInMonth = dayjs().daysInMonth();
      const lbls = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
      const map = new Map(rows.map(r => [Number(r.dia.slice(-2)), Number(r.total)]));
      const data = lbls.map((_, idx) => Number(map.get(idx + 1) ?? 0));

      setLabels(lbls);
      setSerie(data);
    })();
  }, [db]);

  const width = Dimensions.get('window').width - 24;

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <Card style={{ marginBottom: 12, borderRadius: 16 }}>
        <Card.Title title="Resumen mensual" />
        <Card.Content>
          <Text style={{ marginBottom: 6 }}>Ventas: <Money value={totalMes} /></Text>
          <Text>Ganancia: <Money value={gananciaMes} /></Text>
        </Card.Content>
      </Card>

      <Card style={{ borderRadius: 16 }}>
        <Card.Title title="Ventas por dÃ­a (mes actual)" />
        <Card.Content>
          <BarChart
            data={{ labels, datasets: [{ data: serie }] }}
            width={width}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
              propsForBackgroundLines: { strokeDasharray: '4 4' },
            }}
            style={{ borderRadius: 12 }}
            fromZero
            showBarTops={false}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

