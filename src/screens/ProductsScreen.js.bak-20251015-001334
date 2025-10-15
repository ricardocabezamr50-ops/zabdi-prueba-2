import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { List, Searchbar, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useProducts } from '../../dataproducts'; // listProducts()

export default function ProductsScreen() {
  const { listProducts } = useProducts(); // SQLite:contentReference[oaicite:3]{index=3}
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const rows = await listProducts();
    setItems(rows);
  }, [listProducts]);

  // Carga inicial y cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const data = !q
      ? items
      : items.filter(p =>
          (p?.nombre ?? '').toLowerCase().includes(q) ||
          String(p?.talle ?? '').toLowerCase().includes(q)
        );
    setFiltered(data);
  }, [items, query]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={`${item.nombre}  ·  Stock: ${item.stock ?? 0}`}
      description={`Talle: ${item.talle ?? '-'}  ·  Compra: ${item.precio_compra}  ·  Venta: ${item.precio_venta}`}
      left={props => <List.Icon {...props} icon="warehouse" />}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        placeholder="Buscar por nombre o talle"
        value={query}
        onChangeText={setQuery}
        style={{ margin: 12 }}
      />

      {filtered.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text>No hay productos para mostrar.</Text>
          <Text style={{ opacity: 0.6, marginTop: 6 }}>
            Usá el ＋ del header para cargar tu primer producto.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
