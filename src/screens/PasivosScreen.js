import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import RowActions from "../components/RowActions";
import { getAll, deleteItem } from "../storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function PasivosScreen() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();
  const load = async () => setItems(await getAll("passives"));
  useFocusEffect(useCallback(() => { load(); }, []));

  const handleDelete = (id) =>
    Alert.alert("Confirmar", "¿Borrar este pasivo?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: async () => { await deleteItem("passives", id); load(); } },
    ]);

  const handleEdit = (id) => navigation.navigate("PasivoForm", { mode: "edit", id });

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
      <Text style={{ fontWeight: "bold" }}>{item.title ?? "Sin título"}</Text>
      <Text>${item.amount ?? 0} • vence: {item.dueDate ?? ""}</Text>
      <View style={{ marginTop: 8 }}>
        <RowActions onEdit={() => handleEdit(item.id)} onDelete={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return <FlatList data={items} keyExtractor={(x) => x.id} renderItem={renderItem} />;
}