import dayjs from 'dayjs';
export const todayISO = () => dayjs().toISOString();
export const monthKey = (iso) => dayjs(iso).format('YYYY-MM');
export const currency = (n) => {
  if (typeof n !== 'number') return '-';
  return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
};