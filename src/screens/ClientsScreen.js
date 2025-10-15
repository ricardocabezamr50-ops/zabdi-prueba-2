import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useClientas } from '../../dataclientas';

export default function ClientsScreen(){
  const { listClientas, setSaldoCero } = useClientas();
  const [items, setItems] = useState([]);

  const load = useCallback(async ()=>{
    const rows = await listClientas();
    setItems(rows);
  }, [listClientas]);

  useFocusEffect(React.useCallback(() => { load(); }, [load]));

  const cobrar = async (id)=>{
    await setSaldoCero(id);
    await load();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {items.length===0 && <Text>No hay deudas registradas.</Text>}
      {items.map(c=> (
        <Card key={c.id} style={{ marginBottom: 12 }}>
          <Card.Title title={c.nombre} subtitle="Saldo pendiente" />
          <Card.Content>
            <Text style={{ fontWeight:'bold' }}>${Number(c.saldo||0).toFixed(2)}</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={()=> cobrar(c.id)} mode="contained">Registrar cobro total</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}
