import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import RowActions from "../components/RowActions";
import { getAll, deleteItem } from "../storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function ClientsScreen() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const load = async () => setItems(await getAll("clients"));
  useFocusEffect(useCallback(() => { load(); }, []));

  const handleDelete = (id) =>
    Alert.alert("Confirmar", "¿Borrar este cliente?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: async () => { await deleteItem("clients", id); load(); } },
    ]);

  const handleEdit = (id) => navigation.navigate("ClientForm", { mode: "edit", id });

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
      <Text style={{ fontWeight: "bold" }}>{item.name ?? "Sin nombre"}</Text>
      <Text>{item.phone ?? ""} • {item.email ?? ""}</Text>
      <View style={{ marginTop: 8 }}>
        <RowActions onEdit={() => handleEdit(item.id)} onDelete={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return <FlatList data={items} keyExtractor={(x) => x.id} renderItem={renderItem} />;
}