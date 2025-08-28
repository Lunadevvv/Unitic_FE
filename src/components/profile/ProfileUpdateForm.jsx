import React, { useEffect } from 'react';
import { Card, Form, Input, Button, message, Space } from 'antd';
import { useProfile } from '../../hooks/useProfile';
import { useSelector } from 'react-redux';

const ProfileUpdateForm = () => {
  const { updateProfile, updateLoading } = useProfile();
  const { profile } = useSelector(state => state.user);
  const [form] = Form.useForm();

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        mssv: profile.mssv,
        universityId: profile.universityId || profile.university?.id
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values) => {
    try {
      const result = await updateProfile(values);
      
      if (result.success) {
        message.success('Cập nhật thông tin thành công!');
      } else {
        message.error(result.error || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  const fillSampleData = () => {
    form.setFieldsValue({
      firstName: "John",
      lastName: "Doe",
      mssv: "SE12345",
      universityId: "UNI001"
    });
  };

  return (
    <Card title="Cập Nhật Thông Tin Cá Nhân" style={{ margin: '20px 0' }}>
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
          name="firstName"
          label="Tên"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="Tên" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Họ"
          rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
        >
          <Input placeholder="Họ" />
        </Form.Item>

        <Form.Item
          name="mssv"
          label="MSSV"
          rules={[{ required: true, message: 'Vui lòng nhập MSSV' }]}
        >
          <Input placeholder="Mã số sinh viên" />
        </Form.Item>

        <Form.Item
          name="universityId"
          label="Mã trường đại học"
          rules={[{ required: true, message: 'Vui lòng nhập mã trường đại học' }]}
        >
          <Input placeholder="Mã trường đại học" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updateLoading} size="large">
            Cập Nhật Thông Tin
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfileUpdateForm;
