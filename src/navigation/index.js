import React, { useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppContext } from '../context/AppContext';

import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen from '../screens/ProductsScreen';
import SalesScreen from '../screens/SalesScreen';
import ClientsScreen from '../screens/ClientsScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import PasivosScreen from '../screens/PasivosScreen';

import ProductoForm from '../../ProductoForm';
import GastoForm from '../../GastoForm';
import PasivoForm from '../../PasivoForm';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function iconFor(routeName, focused, color, size) {
  const s = size ?? 24;
  const map = {
    Inicio: ['home', 'home-outline'],
    Inventario: ['cube', 'cube-outline'],
    Vender: ['cart', 'cart-outline'],
    Clientes: ['people', 'people-outline'],
    Gastos: ['cash', 'cash-outline'],
    Pasivos: ['wallet', 'wallet-outline'],
  };
  const pair = map[routeName] || ['ellipse', 'ellipse-outline'];
  const name = focused ? pair[0] : pair[1];
  return <Ionicons name={name} size={s} color={color} />;
}

function Tabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: true,
        headerTitleAlign: 'left',
        headerRight: () => {
          if (route.name === 'Inventario') {
            return <Button icon="plus" onPress={() => navigation.navigate('ProductoForm')}>Nuevo</Button>;
          }
          if (route.name === 'Gastos') {
            return <Button icon="plus" onPress={() => navigation.navigate('GastoForm')}>Nuevo</Button>;
          }
          if (route.name === 'Pasivos') {
            return <Button icon="plus" onPress={() => navigation.navigate('PasivoForm')}>Nuevo</Button>;
          }
          return null;
        },
        tabBarIcon: ({ focused, color, size }) => iconFor(route.name, focused, color, size),
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontSize: 11, marginBottom: 2 },
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(10, insets.bottom),
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          elevation: 8,
          backgroundColor: '#fff',
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Inventario" component={ProductsScreen} />
      <Tab.Screen name="Vender" component={SalesScreen} />
      <Tab.Screen name="Clientes" component={ClientsScreen} />
      <Tab.Screen name="Gastos" component={ExpensesScreen} />
      <Tab.Screen name="Pasivos" component={PasivosScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const [state, setState] = useState({ productos: [], ventas: [], clientas: [], gastos: [] });
  const ready = true;

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AppContext.Provider value={{ state, setState }}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="ProductoForm" component={ProductoForm} options={{ title: 'Nuevo producto' }} />
        <Stack.Screen name="GastoForm" component={GastoForm} options={{ title: 'Nuevo gasto' }} />
        <Stack.Screen name="PasivoForm" component={PasivoForm} options={{ title: 'Nuevo pasivo' }} />
      </Stack.Navigator>
    </AppContext.Provider>
  );
}
