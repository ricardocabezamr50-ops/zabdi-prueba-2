import React, { useEffect, useState, useCallback } from 'react';
import { View, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { List, Divider, Text, TextInput, Button } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { usePasivos } from '../../datapassivos';

export default function PasivosScreen() {
  const nav = useNavigation();
  const { listPasivos, pagarPasivo } = usePasivos();

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [montoPago, setMontoPago] = useState('');

  const load = useCallback(async () => {
    const rows = await listPasivos();
    setItems(rows);
  }, [listPasivos]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onPagar = async () => {
    if (!selected) return;
    const m = Number(montoPago);
    if (!Number.isFinite(m) || m <= 0) return Alert.alert('Atención', 'Monto inválido');
    try {
      await pagarPasivo({ pasivoId: selected.id, monto: m });
      Alert.alert('OK', 'Pago registrado.');
      setMontoPago('');
      setSelected(null);
      await load();
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'No se pudo registrar el pago.');
    }
  };

  const renderItem = ({ item }) => (
    <>
      <List.Item
        onPress={() => setSelected(item)}
        title={item.descripcion}
        description={`Total: $${item.monto_total?.toFixed(2) ?? 0}   ·   Saldo: $${item.saldo_pendiente?.toFixed(2) ?? 0}`}
        left={(props) => <List.Icon {...props} icon="wallet" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
    </>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{ padding: 16 }}>
              <Text>No tenés pasivos cargados. Usá “Nuevo” para registrar un préstamo.</Text>
            </View>
          }
        />

        {/* Panel de pago */}
        <View style={{ padding: 12, borderTopWidth: 1, borderColor: '#eee', gap: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {selected ? `Pagar: ${selected.descripcion} · Saldo $${selected.saldo_pendiente?.toFixed(2)}` : 'Elegí un pasivo'}
          </Text>
          <TextInput
            label="Monto del pago"
            keyboardType="numeric"
            value={montoPago}
            onChangeText={setMontoPago}
            disabled={!selected}
            left={<TextInput.Icon icon="cash-minus" />}
          />
          <Button mode="contained" onPress={onPagar} disabled={!selected}>
            Registrar pago
          </Button>
          {selected && <Button onPress={() => { setSelected(null); setMontoPago(''); }}>Cancelar</Button>}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
