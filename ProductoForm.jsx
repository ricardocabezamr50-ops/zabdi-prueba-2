import React from 'react';
import { View, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProducts } from './dataproducts'; // hook con saveProduct

// Validación
const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  precioCompra: z.coerce.number().positive('Debe ser > 0'),
  precioVenta: z.coerce.number().positive('Debe ser > 0'),
  talle: z.coerce.number().int().positive('Debe ser > 0').optional(),
  stock: z.coerce.number().int().min(0).default(0),
});

export default function ProductoForm({ navigation }) {
  const { saveProduct } = useProducts();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      precioCompra: '',
      precioVenta: '',
      talle: '',
      stock: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        precioCompra: Number(data.precioCompra),
        precioVenta: Number(data.precioVenta),
        talle: data.talle ? Number(data.talle) : null,
        stock: data.stock ? Number(data.stock) : 0,
      };
      const res = await saveProduct(payload);
      Alert.alert('Éxito', `Producto guardado (id ${res?.lastInsertRowId ?? '-'})`);
      navigation?.goBack?.();
    } catch (e) {
      console.error('[saveProduct]', e);
      Alert.alert('Error', e?.message ?? 'No se pudo guardar el producto');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nombre*"
            value={value}
            onChangeText={onChange}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="shoe-sneaker" size={20} />} />}
          />
        )}
      />

      <Controller
        control={control}
        name="talle"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Talle"
            keyboardType="numeric"
            value={String(value ?? '')}
            onChangeText={onChange}
            left={<TextInput.Icon icon="ruler" />}
          />
        )}
      />

      <Controller
        control={control}
        name="precioCompra"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Precio compra*"
            keyboardType="numeric"
            value={String(value)}
            onChangeText={onChange}
            left={<TextInput.Icon icon="cash" />}
          />
        )}
      />

      <Controller
        control={control}
        name="precioVenta"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Precio venta*"
            keyboardType="numeric"
            value={String(value)}
            onChangeText={onChange}
            left={<TextInput.Icon icon="cash-multiple" />}
          />
        )}
      />

      <Controller
        control={control}
        name="stock"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Stock"
            keyboardType="numeric"
            value={String(value ?? '')}
            onChangeText={onChange}
            left={<TextInput.Icon icon="warehouse" />}
          />
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Guardar
      </Button>
    </View>
  );
}

