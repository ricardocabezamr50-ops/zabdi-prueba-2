import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Card, HelperText, Snackbar } from 'react-native-paper';
import { useApp } from '../navigation';
import { v4 as uuid } from 'uuid';

export default function ProductFormScreen({ route, navigation }) {
  const editItem = route?.params?.item;
  const { state, setState } = useApp();
  const [form, setForm] = useState({
    nombre: editItem?.nombre ?? '',
    talle: editItem?.talle ?? '',
    precioCompra: editItem?.precioCompra?.toString?.() ?? '',
    precioVenta: editItem?.precioVenta?.toString?.() ?? '',
    stock: editItem?.stock?.toString?.() ?? '0',
  });
  const [snack, setSnack] = useState({ visible: false, msg: '' });

  const showErr = (msg) => setSnack({ visible: true, msg });

  const parseNum = (v) => {
    const n = Number((v ?? '').toString().replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  };

  const validate = () => {
    if (!form.nombre.trim()) return 'Completá el nombre.';
    if (!form.talle.toString().trim()) return 'Completá el talle.';
    const pc = parseNum(form.precioCompra);
    const pv = parseNum(form.precioVenta);
    const st = parseNum(form.stock);
    if (Number.isNaN(pc) || pc < 0) return 'Precio de compra inválido.';
    if (Number.isNaN(pv) || pv <= 0) return 'Precio de venta inválido.';
    if (Number.isNaN(st) || st < 0) return 'Stock inválido.';
    return null;
  };

  const saveItem = () => {
    const err = validate();
    if (err) return showErr(err);

    const data = {
      nombre: form.nombre.trim(),
      talle: form.talle.toString().trim(),
      precioCompra: parseNum(form.precioCompra),
      precioVenta: parseNum(form.precioVenta),
      stock: parseNum(form.stock),
    };

    try {
      if (editItem) {
        const productos = state.productos.map((p) =>
          p.id === editItem.id ? { ...editItem, ...data } : p
        );
        setState({ ...state, productos });
      } else {
        const nuevo = { id: uuid(), ...data };
        setState({ ...state, productos: [nuevo, ...state.productos] });
      }
      navigation.goBack();
    } catch (e) {
      showErr('No se pudo guardar. Reintentá.');
    }
  };

  const hasError = (key) => {
    if (key === 'precioCompra') return form.precioCompra !== '' && Number.isNaN(parseNum(form.precioCompra));
    if (key === 'precioVenta') return form.precioVenta !== '' && Number.isNaN(parseNum(form.precioVenta));
    if (key === 'stock') return form.stock !== '' && Number.isNaN(parseNum(form.stock));
    return false;
  };

  return (
    <View style={{ padding: 16 }}>
      <Card>
        <Card.Title title={editItem ? 'Editar producto' : 'Nuevo producto'} />
        <Card.Content>
          <TextInput
            label="Nombre*"
            value={form.nombre}
            onChangeText={(t) => setForm({ ...form, nombre: t })}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Talle*"
            value={form.talle}
            onChangeText={(t) => setForm({ ...form, talle: t })}
            style={{ marginBottom: 8 }}
          />
          <TextInput
            label="Precio compra*"
            value={form.precioCompra}
            onChangeText={(t) => setForm({ ...form, precioCompra: t })}
            keyboardType="decimal-pad"
            style={{ marginBottom: 4 }}
          />
          {hasError('precioCompra') && <HelperText type="error">Número inválido</HelperText>}

          <TextInput
            label="Precio venta*"
            value={form.precioVenta}
            onChangeText={(t) => setForm({ ...form, precioVenta: t })}
            keyboardType="decimal-pad"
            style={{ marginBottom: 4 }}
          />
          {hasError('precioVenta') && <HelperText type="error">Número inválido</HelperText>}

          <TextInput
            label="Stock*"
            value={form.stock}
            onChangeText={(t) => setForm({ ...form, stock: t })}
            keyboardType="number-pad"
            style={{ marginBottom: 4 }}
          />
          {hasError('stock') && <HelperText type="error">Número inválido</HelperText>}
        </Card.Content>
        <Card.Actions style={{ justifyContent: 'flex-end' }}>
          <Button onPress={() => navigation.goBack()}>Cancelar</Button>
          <Button mode="contained" onPress={saveItem}>
            Guardar
          </Button>
        </Card.Actions>
      </Card>

      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ visible: false, msg: '' })}
        duration={3000}
      >
        {snack.msg}
      </Snackbar>
    </View>
  );
}