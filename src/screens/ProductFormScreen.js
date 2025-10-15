import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { addItem, getById, updateItem } from "../storage";

export default function ProductFormScreen({ route, navigation }) {
  const mode = route?.params?.mode || "create";
  const id = route?.params?.id || null;

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const item = await getById("products", id);
        if (!item) { Alert.alert("Error", "Producto no encontrado"); navigation.goBack(); return; }
        setName(item.name ?? "");
        setSku(item.sku ?? "");
        setStock(String(item.stock ?? ""));
      })();
    }
  }, [mode, id]);

  const onSubmit = async () => {
    if (!name.trim()) { Alert.alert("ValidaciÃ³n", "IngresÃ¡ un nombre"); return; }
    const payload = { name, sku, stock: Number(stock) || 0 };
    if (mode === "edit" && id) await updateItem("products", id, payload);
    else await addItem("products", payload);
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="SKU" value={sku} onChangeText={setSku} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={{ borderWidth: 1, padding: 8 }} />
      <Button title={mode === "edit" ? "Guardar cambios" : "Crear producto"} onPress={onSubmit} />
    </View>
  );
}
