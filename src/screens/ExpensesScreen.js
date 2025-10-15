import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput, Button, List, Text, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useDb } from '../../data';

export default function ExpensesScreen(){
  const db = useDb();
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    const rows = await db.getAllAsync(`SELECT * FROM gastos ORDER BY id DESC`);
    setItems(rows);
  }, [db]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => { load(); }, [load]);

  const agregar = async ()=>{
    const m = Number(monto);
    if (!concepto.trim() || !Number.isFinite(m) || m <= 0) return;
    await db.runAsync(
      `INSERT INTO gastos (descripcion, monto, fecha) VALUES (?,?,?)`,
      [concepto.trim(), m, new Date().toISOString()]
    );
    setConcepto(''); setMonto('');
    await load();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput label="Concepto" value={concepto} onChangeText={setConcepto} style={{ marginBottom: 8 }} />
      <TextInput label="Monto" value={monto} onChangeText={setMonto} keyboardType="numeric" style={{ marginBottom: 8 }} />
      <Button mode="contained" onPress={agregar}>Agregar gasto</Button>

      <Divider style={{ marginVertical: 12 }} />
      {items.length === 0 && <Text>Sin gastos aún.</Text>}
      {items.map(g=> (
        <List.Item
          key={g.id}
          title={g.descripcion}
          description={new Date(g.fecha).toLocaleDateString()}
          right={()=> <Text style={{ alignSelf:'center' }}>${Number(g.monto).toFixed(2)}</Text>}
        />
      ))}
    </ScrollView>
  );
}
