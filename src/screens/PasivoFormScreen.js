import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { addItem, getById, updateItem } from "../storage";

export default function PasivoFormScreen({ route, navigation }) {
  const mode = route?.params?.mode || "create";
  const id = route?.params?.id || null;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const item = await getById("passives", id);
        if (!item) { Alert.alert("Error", "Pasivo no encontrado"); navigation.goBack(); return; }
        setTitle(item.title ?? ""); setAmount(String(item.amount ?? "")); setDueDate(item.dueDate ?? "");
      })();
    }
  }, [mode, id]);

  const onSubmit = async () => {
    if (!title.trim()) { Alert.alert("Validación", "Ingresá un título"); return; }
    const payload = { title, amount: Number(amount) || 0, dueDate };
    if (mode === "edit" && id) await updateItem("passives", id, payload);
    else await addItem("passives", payload);
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Vencimiento" value={dueDate} onChangeText={setDueDate} style={{ borderWidth: 1, padding: 8 }} />
      <Button title={mode === "edit" ? "Guardar cambios" : "Crear pasivo"} onPress={onSubmit} />
    </View>
  );
}