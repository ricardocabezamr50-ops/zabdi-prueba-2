// src/context/AppContext.js
import React, { createContext, useContext } from 'react';

export const AppContext = createContext({
  state: { productos: [], ventas: [], clientas: [], gastos: [] },
  setState: () => {},
});

export const useApp = () => useContext(AppContext);

