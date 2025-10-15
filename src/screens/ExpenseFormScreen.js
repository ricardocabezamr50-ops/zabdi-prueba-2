import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { addItem, getById, updateItem } from "../storage";

export default function ExpenseFormScreen({ route, navigation }) {
  const mode = route?.params?.mode || "create";
  const id = route?.params?.id || null;

  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const item = await getById("expenses", id);
        if (!item) { Alert.alert("Error", "Gasto no encontrado"); navigation.goBack(); return; }
        setConcept(item.concept ?? ""); setAmount(String(item.amount ?? "")); setDate(item.date ?? "");
      })();
    }
  }, [mode, id]);

  const onSubmit = async () => {
    if (!concept.trim()) { Alert.alert("ValidaciÃ³n", "IngresÃ¡ un concepto"); return; }
    const payload = { concept, amount: Number(amount) || 0, date };
    if (mode === "edit" && id) await updateItem("expenses", id, payload);
    else await addItem("expenses", payload);
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput placeholder="Concepto" value={concept} onChangeText={setConcept} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Monto" value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Fecha" value={date} onChangeText={setDate} style={{ borderWidth: 1, padding: 8 }} />
      <Button title={mode === "edit" ? "Guardar cambios" : "Crear gasto"} onPress={onSubmit} />
    </View>
  );
}
