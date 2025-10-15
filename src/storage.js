import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  products: "@zabdi/products",
  clients: "@zabdi/clients",
  expenses: "@zabdi/expenses",
  passives: "@zabdi/passives",
};

const load = async (collection) => {
  const key = KEYS[collection];
  if (!key) throw new Error(`Colección desconocida: ${collection}`);
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
};

const save = async (collection, list) => {
  const key = KEYS[collection];
  if (!key) throw new Error(`Colección desconocida: ${collection}`);
  await AsyncStorage.setItem(key, JSON.stringify(list));
};

const genId = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-6);

export const getAll = async (collection) => await load(collection);

export const getById = async (collection, id) => {
  const list = await load(collection);
  return list.find((x) => x.id === id) || null;
};

export const addItem = async (collection, item) => {
  const list = await load(collection);
  const withId = { id: item.id || genId(), ...item };
  await save(collection, [withId, ...list]);
  return withId;
};

export const updateItem = async (collection, id, partial) => {
  const list = await load(collection);
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error(`No existe ${collection} id=${id}`);
  const updated = { ...list[idx], ...partial, id };
  const next = [...list];
  next[idx] = updated;
  await save(collection, next);
  return updated;
};

export const deleteItem = async (collection, id) => {
  const list = await load(collection);
  const next = list.filter((x) => x.id !== id);
  await save(collection, next);
  return true;
};