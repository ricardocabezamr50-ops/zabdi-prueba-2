import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation';
import { theme } from './src/theme';
import { SQLiteProvider } from 'expo-sqlite';
import { initDb } from './data';

export default function App() {
  return (
    <SQLiteProvider databaseName="zabdi.db" onInit={initDb}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SQLiteProvider>
  );
}
