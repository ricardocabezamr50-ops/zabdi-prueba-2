import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function EmptyState({ title, subtitle }) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text variant="titleMedium">{title}</Text>
      {subtitle ? <Text style={{ opacity: 0.7, marginTop: 6 }}>{subtitle}</Text> : null}
    </View>
  );
}
