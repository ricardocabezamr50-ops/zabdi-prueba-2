import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { addItem, getById, updateItem } from "../storage";

export default function ClientFormScreen({ route, navigation }) {
  const mode = route?.params?.mode || "create";
  const id = route?.params?.id || null;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const item = await getById("clients", id);
        if (!item) { Alert.alert("Error", "Cliente no encontrado"); navigation.goBack(); return; }
        setName(item.name ?? ""); setPhone(item.phone ?? ""); setEmail(item.email ?? "");
      })();
    }
  }, [mode, id]);

  const onSubmit = async () => {
    if (!name.trim()) { Alert.alert("ValidaciÃ³n", "IngresÃ¡ un nombre"); return; }
    const payload = { name, phone, email };
    if (mode === "edit" && id) await updateItem("clients", id, payload);
    else await addItem("clients", payload);
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="TelÃ©fono" value={phone} onChangeText={setPhone} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8 }} />
      <Button title={mode === "edit" ? "Guardar cambios" : "Crear cliente"} onPress={onSubmit} />
    </View>
  );
}
