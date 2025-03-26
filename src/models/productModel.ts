export type DonHangStatus = 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy';

export interface SanPhamTrongDon {
  tenSanPham: string;
  soLuong: number;
  donGia: number;
}

export interface DonHang {
  id: string;
  khachHang: string;
  ngayDat: string;
  sanPham: SanPhamTrongDon[];
  tongTien: number;
  trangThai: DonHangStatus;
}