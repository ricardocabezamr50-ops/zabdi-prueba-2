import React from 'react';
import { Text } from 'react-native-paper';
import { currency } from '../utils';
export default function Money({ value, style }) {
  return <Text style={style}>{currency(value)}</Text>;
}
