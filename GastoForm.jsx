import React from 'react';
import { View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExpenses } from './datagastos'; // hook con saveExpense

// Validación
const schema = z.object({
  descripcion: z.string().min(1, 'Requerido'),
  monto: z.coerce.number().positive('Debe ser > 0'),
  // si la dejás vacía, guardamos fecha/hora actual en el save
  fecha: z.string().optional(),
});

export default function GastoForm({ navigation }) {
  const { saveExpense } = useExpenses();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { descripcion: '', monto: '', fecha: '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await saveExpense({
        descripcion: data.descripcion.trim(),
        monto: Number(data.monto),
        fecha: data.fecha?.trim() || undefined,
      });
      Alert.alert('Éxito', `Gasto guardado (id ${res?.lastInsertRowId ?? '-'})`);
      navigation?.goBack?.();
    } catch (e) {
      console.error('[saveExpense]', e);
      Alert.alert('Error', e?.message ?? 'No se pudo guardar el gasto');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Controller
        control={control}
        name="descripcion"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Descripción*"
            value={value}
            onChangeText={onChange}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="text" size={20} />} />}
          />
        )}
      />

      <Controller
        control={control}
        name="monto"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Monto*"
            keyboardType="numeric"
            value={String(value)}
            onChangeText={onChange}
            left={<TextInput.Icon icon="cash" />}
          />
        )}
      />

      <Controller
        control={control}
        name="fecha"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Fecha (ISO opcional)"
            placeholder="2025-09-02T12:00:00.000Z"
            value={value}
            onChangeText={onChange}
            left={<TextInput.Icon icon="calendar" />}
          />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Guardar gasto
      </Button>
    </View>
  );
}

