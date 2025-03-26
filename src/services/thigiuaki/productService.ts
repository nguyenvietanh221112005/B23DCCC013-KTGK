import { DonHang } from '../../models/productModel';

const STORAGE_KEY = 'dsDonHang';

export const DonHangService = {
  getAll(): DonHang[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveAll(data: DonHang[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  add(don: DonHang) {
    const data = this.getAll();
    data.push(don);
    this.saveAll(data);
  },
  update(id: string, newData: Partial<DonHang>) {
    const data = this.getAll().map(d => (d.id === id ? { ...d, ...newData } : d));
    this.saveAll(data);
  },
  remove(id: string) {
    const data = this.getAll().filter(d => d.id !== id);
    this.saveAll(data);
  },
};