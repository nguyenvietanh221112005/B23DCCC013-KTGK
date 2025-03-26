import { useState } from 'react';
import { DonHang } from '../models/productModel';
import { DonHangService } from '../services/thigiuaki/productService';

export const useDonHangModel = () => {
  const [dsDonHang, setDsDonHang] = useState<DonHang[]>(DonHangService.getAll());

  const reload = () => {
    setDsDonHang(DonHangService.getAll());
  };

  const addDonHang = (don: DonHang) => {
    DonHangService.add(don);
    reload();
  };

  const updateDonHang = (id: string, newData: Partial<DonHang>) => {
    DonHangService.update(id, newData);
    reload();
  };

  const removeDonHang = (id: string) => {
    DonHangService.remove(id);
    reload();
  };

  return {
    dsDonHang,
    addDonHang,
    updateDonHang,
    removeDonHang,
    reload,
  };
}