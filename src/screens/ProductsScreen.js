import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import RowActions from "../components/RowActions";
import { getAll, deleteItem } from "../storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function ProductsScreen() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();

  const load = async () => setItems(await getAll("products"));
  useFocusEffect(useCallback(() => { load(); }, []));

  const handleDelete = (id) => {
    Alert.alert("Confirmar", "Â¿Borrar este producto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: async () => { await deleteItem("products", id); load(); } },
    ]);
  };

  const handleEdit = (id) => {
      const parent = typeof navigation.getParent === "function" ? navigation.getParent() : null;
      if (parent) parent.navigate("ProductForm", { mode: "edit", id });
      else navigation.navigate("ProductForm", { mode: "edit", id });
    };

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
      <Text style={{ fontWeight: "bold" }}>{item.name ?? "Sin nombre"}</Text>
      <Text>{item.sku ?? ""} â€¢ Stock: {item.stock ?? 0}</Text>
      <View style={{ marginTop: 8 }}>
        <RowActions onEdit={() => handleEdit(item.id)} onDelete={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(x) => x.id}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={{ padding: 16 }}>Sin productos</Text>}
    />
  );
}
