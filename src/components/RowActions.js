import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RowActions({ onEdit, onDelete }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={[styles.btn, styles.edit]} onPress={onEdit}>
        <Text style={styles.txt}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.del]} onPress={onDelete}>
        <Text style={styles.txt}>Borrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  btn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  edit: { backgroundColor: "#1f6feb" },
  del: { backgroundColor: "#d73a49" },
  txt: { color: "white", fontWeight: "bold" },
});
