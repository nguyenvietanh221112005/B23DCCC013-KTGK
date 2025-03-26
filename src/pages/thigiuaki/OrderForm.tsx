import { Button, Form, Input, InputNumber, Modal, Select, Space, message } from 'antd';
import { useEffect } from 'react';
import { DonHang, DonHangStatus, SanPhamTrongDon } from '@/models/donhang';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

interface OrderFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (donHang: DonHang) => void;
  initData?: DonHang;
}

const OrderForm = ({ visible, onClose, onSubmit, initData }: OrderFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initData) {
      form.setFieldsValue({
        khachHang: initData.khachHang,
        sanPham: initData.sanPham,
        trangThai: initData.trangThai,
      });
    } else {
      form.resetFields();
    }
  }, [initData]);

  const handleFinish = (values: any) => {
    const { khachHang, sanPham, trangThai } = values;

    if (!khachHang || !sanPham || sanPham.length === 0) {
      message.error('Vui lòng điền đầy đủ thông tin đơn hàng!');
      return;
    }

    const tongTien = sanPham.reduce(
      (total: number, sp: SanPhamTrongDon) => total + sp.soLuong * sp.donGia,
      0
    );

    const donHang: DonHang = {
      id: initData?.id || uuidv4(),
      khachHang,
      ngayDat: initData?.ngayDat || new Date().toISOString(),
      sanPham,
      tongTien,
      trangThai,
    };

    onSubmit(donHang);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={initData ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng'}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Khách hàng"
          name="khachHang"
          rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.List name="sanPham" rules={[{ required: true }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'tenSanPham']}
                    rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
                  >
                    <Input placeholder="Tên sản phẩm" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'soLuong']}
                    rules={[{ required: true, message: 'Nhập số lượng' }]}
                  >
                    <InputNumber placeholder="Số lượng" min={1} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'donGia']}
                    rules={[{ required: true, message: 'Nhập đơn giá' }]}
                  >
                    <InputNumber placeholder="Đơn giá" min={0} step={1000} />
                  </Form.Item>
                  <Button onClick={() => remove(name)} danger>Xoá</Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item label="Trạng thái" name="trangThai" initialValue="Chờ xác nhận">
          <Select>
            <Option value="Chờ xác nhận">Chờ xác nhận</Option>
            <Option value="Đang giao">Đang giao</Option>
            <Option value="Hoàn thành">Hoàn thành</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button htmlType="submit" type="primary">
              Lưu
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderForm;