import React from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import Money from './Money';

export default function ProductCard({ item, onEdit }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title title={item.nombre} subtitle={`Talle ${item.talle}`} right={(props) => (
        <IconButton {...props} icon="pencil" onPress={() => onEdit && onEdit(item)} />
      )} />
      <Card.Content>
        <Text>Compra: <Money value={item.precioCompra} /></Text>
        <Text>Venta: <Money value={item.precioVenta} /></Text>
        <Text>Stock: {item.stock ?? 0}</Text>
      </Card.Content>
    </Card>
  );
}
