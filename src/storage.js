import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  productos: 'prod_v1',
  ventas: 'ventas_v1',
  clientas: 'clientas_v1',
  gastos: 'gastos_v1'
};

export async function loadAll() {
  const [p, v, c, g] = await Promise.all([
    AsyncStorage.getItem(KEYS.productos),
    AsyncStorage.getItem(KEYS.ventas),
    AsyncStorage.getItem(KEYS.clientas),
    AsyncStorage.getItem(KEYS.gastos)
  ]);
  return {
    productos: p ? JSON.parse(p) : [],
    ventas: v ? JSON.parse(v) : [],
    clientas: c ? JSON.parse(c) : [],
    gastos: g ? JSON.parse(g) : []
  };
}

export async function save(key, value) {
  return AsyncStorage.setItem(KEYS[key], JSON.stringify(value));
}