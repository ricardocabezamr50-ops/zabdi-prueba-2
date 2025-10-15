import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { usePasivos } from './datapassivos';

export default function PasivoForm() {
  const nav = useNavigation();
  const { addPasivo } = usePasivos();

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  const onSave = async () => {
    const m = Number(monto);
    if (!descripcion.trim() || !Number.isFinite(m) || m <= 0) return;
    await addPasivo({ descripcion: descripcion.trim(), monto: m });
    nav.goBack();
  };

  const montoInvalido = monto !== '' && (!Number.isFinite(Number(monto)) || Number(monto) <= 0);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput label="Descripción" value={descripcion} onChangeText={setDescripcion} style={{ marginBottom: 8 }} />
      <TextInput label="Monto total" keyboardType="numeric" value={monto} onChangeText={setMonto} style={{ marginBottom: 8 }} />
      <HelperText type="error" visible={montoInvalido}>Monto inválido</HelperText>
      <Button mode="contained" onPress={onSave} disabled={!descripcion.trim() || montoInvalido}>Guardar</Button>
    </ScrollView>
  );
}
