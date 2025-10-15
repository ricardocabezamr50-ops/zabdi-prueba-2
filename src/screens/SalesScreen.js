import React, { useEffect, useState, useCallback } from 'react';
import { View, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Searchbar, List, Divider, TextInput, Button, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useProducts } from '../../dataproducts';
import { useSales } from '../../datasales';
import { useClientas } from '../../dataclientas';

export default function SalesScreen() {
  const { listProducts } = useProducts();
  const { saveSale } = useSales();
  const { upsertSaldo } = useClientas();

  const [allProducts, setAllProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [clienta, setClienta] = useState('');
  const [pagoRecibido, setPagoRecibido] = useState('');

  const load = useCallback(async () => {
    const rows = await listProducts();
    setAllProducts(rows);
  }, [listProducts]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const data = !q
      ? allProducts
      : allProducts.filter(p =>
          (p?.nombre ?? '').toLowerCase().includes(q) ||
          String(p?.talle ?? '').toLowerCase().includes(q)
        );
    setFiltered(data);
  }, [allProducts, query]);

  const chooseProduct = (p) => {
    setSelected(p);
    setQty('1');
    setUnitPrice(String(p?.precio_venta ?? ''));
    setPagoRecibido('');
  };

  const clearSelection = () => {
    setSelected(null); setQty(''); setUnitPrice(''); setClienta(''); setPagoRecibido('');
  };

  const confirmSale = async () => {
    const quantity = Number(qty);
    const price = Number(unitPrice);
    const pago = pagoRecibido === '' ? null : Number(pagoRecibido);

    if (!selected) return Alert.alert('Atención', 'Elegí un producto primero.');
    if (!Number.isFinite(quantity) || quantity <= 0) return Alert.alert('Atención', 'Cantidad inválida.');
    if (!Number.isFinite(price) || price <= 0) return Alert.alert('Atención', 'Precio inválido.');
    if (pago !== null && (!Number.isFinite(pago) || pago < 0)) return Alert.alert('Atención', 'Pago inválido.');

    try {
      const res = await saveSale({
        productoId: selected.id,
        cantidad: quantity,
        precioUnit: price,
        pagado: pago, // 👈 ahora guardamos el pago parcial en DB
      });

      const total = res?.total ?? (quantity * price);
      const pagado = res?.pagado ?? (pago ?? total);
      const saldo = total - pagado;

      // Si hay saldo y hay nombre de clienta -> actualizamos en DB
      if (saldo > 0 && clienta.trim()) {
        await upsertSaldo({ nombre: clienta.trim(), delta: saldo });
      }

      Alert.alert(
        'Venta registrada',
        `Total $${total.toFixed(2)} · Pagado $${pagado.toFixed(2)} · Saldo $${(total - pagado).toFixed(2)}`
      );

      clearSelection();
      await load();
    } catch (e) {
      console.error('[confirmSale]', e);
      Alert.alert('Error', e?.message ?? 'No se pudo registrar la venta');
    }
  };

  const renderItem = ({ item }) => (
    <>
      <List.Item
        onPress={() => chooseProduct(item)}
        title={`${item.nombre}  ·  $${item.precio_venta}`}
        description={`Talle: ${item.talle ?? '-'}    Stock: ${item.stock ?? 0}`}
        left={props => <List.Icon {...props} icon="shopping" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
    </>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1 }}>
        <Searchbar placeholder="Buscar producto (nombre o talle)" value={query} onChangeText={setQuery} style={{ margin: 12 }} />
        <FlatList data={filtered} keyExtractor={(item) => String(item.id)} renderItem={renderItem} />

        <View style={{ padding: 12, borderTopWidth: 1, borderColor: '#eee', gap: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {selected ? `Producto: ${selected.nombre}` : 'Elegí un producto'}
          </Text>
          <TextInput label="Cantidad" keyboardType="numeric" value={qty} onChangeText={setQty} disabled={!selected} left={<TextInput.Icon icon="counter" />} />
          <TextInput label="Precio unitario" keyboardType="numeric" value={unitPrice} onChangeText={setUnitPrice} disabled={!selected} left={<TextInput.Icon icon="cash" />} />
          <TextInput label="Clienta (opcional)" value={clienta} onChangeText={setClienta} disabled={!selected} left={<TextInput.Icon icon="account" />} />
          <TextInput label="Pago recibido (opcional)" keyboardType="numeric" value={pagoRecibido} onChangeText={setPagoRecibido} disabled={!selected} left={<TextInput.Icon icon="cash-multiple" />} placeholder="Dejá vacío si paga todo" />
          <Button mode="contained" onPress={confirmSale} disabled={!selected}>Registrar venta (descontar stock)</Button>
          {selected && <Button onPress={clearSelection}>Cancelar selección</Button>}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
