import { Table, Input, Select, Button, Space, message, Popconfirm } from 'antd';
import { useDonHangModel } from '@/models/useDonHangModel'; 
import { DonHang, DonHangStatus } from '@/models/donhang';
import { useState } from 'react';
import OrderForm from './OrderForm';

const { Option } = Select;

const DanhSachDonHang = () => {
  const { dsDonHang, addDonHang, updateDonHang, removeDonHang } = useDonHangModel();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DonHangStatus | ''>('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DonHang | undefined>(undefined);

  const handleHuy = (id: string, trangThai: DonHangStatus) => {
    if (trangThai !== 'Chờ xác nhận') {
      message.warning('Chỉ có thể hủy đơn hàng đang chờ xác nhận');
      return;
    }
    updateDonHang(id, { trangThai: 'Hủy' });
    message.success('Đơn hàng đã được hủy');
  };

  const handleAddOrUpdate = (donHang: DonHang) => {
    const existed = dsDonHang.find(d => d.id === donHang.id);
    if (existed) {
      updateDonHang(donHang.id, donHang);
      message.success('Cập nhật đơn hàng thành công');
    } else {
      addDonHang(donHang);
      message.success('Thêm đơn hàng mới thành công');
    }
    setOpenModal(false);
    setSelectedOrder(undefined);
  };

  const handleEdit = (record: DonHang) => {
    setSelectedOrder(record);
    setOpenModal(true);
  };

  const filteredData = dsDonHang
    .filter(d =>
      (d.khachHang.toLowerCase().includes(search.toLowerCase()) ||
        d.id.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter ? d.trangThai === statusFilter : true)
    );

  const columns = [
    { title: 'Mã Đơn', dataIndex: 'id' },
    { title: 'Khách Hàng', dataIndex: 'khachHang' },
    {
      title: 'Ngày Đặt',
      dataIndex: 'ngayDat',
      sorter: (a: DonHang, b: DonHang) =>
        new Date(a.ngayDat).getTime() - new Date(b.ngayDat).getTime(),
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'tongTien',
      render: (value: number) => value.toLocaleString() + 'đ',
      sorter: (a: DonHang, b: DonHang) => a.tongTien - b.tongTien,
    },
    { title: 'Trạng Thái', dataIndex: 'trangThai' },
    {
      title: 'Thao tác',
      render: (_: any, record: DonHang) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn hủy đơn này?"
            onConfirm={() => handleHuy(record.id, record.trangThai)}
            okText="Hủy đơn"
            cancelText="Không"
          >
            <Button danger disabled={record.trangThai !== 'Chờ xác nhận'}>
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách đơn hàng</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm mã đơn hoặc khách hàng"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Lọc trạng thái"
          allowClear
          onChange={(val) => setStatusFilter(val)}
          style={{ width: 200 }}
        >
          <Option value="Chờ xác nhận">Chờ xác nhận</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Hủy">Hủy</Option>
        </Select>
        <Button type="primary" onClick={() => {
          setSelectedOrder(undefined);
          setOpenModal(true);
        }}>
          + Thêm đơn hàng
        </Button>
      </Space>

      <Table rowKey="id" dataSource={filteredData} columns={columns} />

      <OrderForm
        visible={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddOrUpdate}
        initData={selectedOrder}
      />
    </div>
  );
};

export default DanhSachDonHang;