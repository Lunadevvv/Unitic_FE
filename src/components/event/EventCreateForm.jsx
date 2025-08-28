import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, DatePicker, message, Space } from 'antd';
import { useEvents } from '../../hooks/useEvents';
import { formatDateForAPI } from '../../utils/dateUtils';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EventCreateForm = () => {
  const { createEvent } = useEvents();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const eventData = {
        name: values.name,
        image: values.image || "https://example.com/images/painting_workshop.jpg",
        description: values.description,
        date_Start: formatDateForAPI(values.dateRange[0]),
        date_End: formatDateForAPI(values.dateRange[1]),
        price: values.price,
        cateID: values.cateID,
        slot: values.slot,
        location: values.location
      };

      const result = await createEvent(eventData);
      
      if (result.success) {
        message.success('Tạo sự kiện thành công!');
        form.resetFields();
      } else {
        message.error(result.error || 'Có lỗi xảy ra khi tạo sự kiện');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fillSampleData = () => {
    form.setFieldsValue({
      name: "Workshop Trải nghiệm Vẽ Tranh Acrylic",
      description: "Thư giãn và thỏa sức sáng tạo với buổi workshop vẽ tranh cho người mới bắt đầu.",
      location: "Phòng Art Studio, Tầng 3, Tòa nhà FPT University",
      dateRange: [
        moment("2025-09-10T14:00:00"),
        moment("2025-09-10T17:00:00")
      ],
      price: 250000,
      cateID: "Cate0001",
      slot: 15,
      image: "https://example.com/images/painting_workshop.jpg"
    });
  };



  return (
    <Card title="Tạo Sự Kiện Mới" style={{ margin: '20px 0' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={fillSampleData} type="dashed">
          Điền dữ liệu mẫu
        </Button>
      </Space>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Tên sự kiện"
          rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
        >
          <Input placeholder="Tên sự kiện" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <TextArea rows={4} placeholder="Mô tả sự kiện" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Địa điểm"
          rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
        >
          <Input placeholder="Địa điểm tổ chức sự kiện" />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Thời gian"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
        >
          <RangePicker 
            showTime 
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá vé"
          rules={[{ required: true, message: 'Vui lòng nhập giá vé' }]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="Giá vé (VND)"
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="cateID"
          label="Mã danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập mã danh mục' }]}
        >
          <Input placeholder="Mã danh mục (ví dụ: Cate0001)" />
        </Form.Item>

        <Form.Item
          name="slot"
          label="Số lượng slots"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng slots' }]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="Số lượng slots"
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="URL hình ảnh"
        >
          <Input placeholder="URL hình ảnh (tùy chọn)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Tạo Sự Kiện
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EventCreateForm;
