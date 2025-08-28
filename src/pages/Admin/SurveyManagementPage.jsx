import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Modal, Form, Input, Select, Space, 
  message, Popconfirm, Tag, DatePicker, Switch 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  SendOutlined, BarChartOutlined 
} from '@ant-design/icons';
import AdminLayout from '../../components/layout/AdminLayout';

const { TextArea } = Input;
const { Option } = Select;

const SurveyManagementPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const mockSurveys = [
    {
      id: 1,
      title: 'Khảo sát sự kiện Workshop UX/UI',
      eventId: 1,
      eventName: 'Workshop UX/UI Design 2024',
      status: 'active',
      totalQuestions: 8,
      responses: 23,
      createdAt: '2024-01-10',
      sentAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Đánh giá chất lượng seminar Marketing',
      eventId: 2,
      eventName: 'Seminar Marketing Digital',
      status: 'draft',
      totalQuestions: 10,
      responses: 0,
      createdAt: '2024-01-12',
      sentAt: null
    }
  ];

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSurveys(mockSurveys);
    } catch (error) {
      message.error('Không thể tải danh sách khảo sát!');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = () => {
    setEditingSurvey(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditSurvey = (survey) => {
    setEditingSurvey(survey);
    form.setFieldsValue(survey);
    setModalVisible(true);
  };

  const handleSaveSurvey = async (values) => {
    try {
      if (editingSurvey) {
        // Update
        setSurveys(prev => prev.map(s => 
          s.id === editingSurvey.id ? { ...s, ...values } : s
        ));
        message.success('Cập nhật khảo sát thành công!');
      } else {
        // Create
        const newSurvey = {
          id: Date.now(),
          ...values,
          status: 'draft',
          responses: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setSurveys(prev => [newSurvey, ...prev]);
        message.success('Tạo khảo sát thành công!');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleDeleteSurvey = async (id) => {
    try {
      setSurveys(prev => prev.filter(s => s.id !== id));
      message.success('Xóa khảo sát thành công!');
    } catch (error) {
      message.error('Không thể xóa khảo sát!');
    }
  };

  const handleSendSurvey = async (id) => {
    try {
      setSurveys(prev => prev.map(s => 
        s.id === id 
          ? { ...s, status: 'active', sentAt: new Date().toISOString().split('T')[0] }
          : s
      ));
      message.success('Gửi khảo sát thành công!');
    } catch (error) {
      message.error('Không thể gửi khảo sát!');
    }
  };

  const columns = [
    {
      title: 'Tiêu đề khảo sát',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Sự kiện: {record.eventName}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          draft: 'orange',
          active: 'green',
          closed: 'red'
        };
        const labels = {
          draft: 'Nháp',
          active: 'Đang hoạt động',
          closed: 'Đã đóng'
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      }
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
      align: 'center',
      render: (count) => `${count} câu hỏi`
    },
    {
      title: 'Phản hồi',
      dataIndex: 'responses',
      key: 'responses',
      align: 'center',
      render: (count) => `${count} phản hồi`
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            title="Xem chi tiết"
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditSurvey(record)}
            title="Chỉnh sửa"
          />
          {record.status === 'draft' && (
            <Button
              icon={<SendOutlined />}
              size="small"
              type="primary"
              onClick={() => handleSendSurvey(record.id)}
              title="Gửi khảo sát"
            />
          )}
          <Button
            icon={<BarChartOutlined />}
            size="small"
            title="Xem thống kê"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa khảo sát này?"
            onConfirm={() => handleDeleteSurvey(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="survey-management-page">
        <Card
          title="Quản lý khảo sát"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateSurvey}
            >
              Tạo khảo sát mới
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={surveys}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} khảo sát`,
            }}
          />
        </Card>

        <Modal
          title={editingSurvey ? 'Chỉnh sửa khảo sát' : 'Tạo khảo sát mới'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveSurvey}
          >
            <Form.Item
              name="title"
              label="Tiêu đề khảo sát"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
            >
              <Input placeholder="Nhập tiêu đề khảo sát" />
            </Form.Item>

            <Form.Item
              name="eventId"
              label="Sự kiện"
              rules={[{ required: true, message: 'Vui lòng chọn sự kiện!' }]}
            >
              <Select placeholder="Chọn sự kiện">
                <Option value={1}>Workshop UX/UI Design 2024</Option>
                <Option value={2}>Seminar Marketing Digital</Option>
                <Option value={3}>Conference Tech 2024</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea 
                rows={3} 
                placeholder="Mô tả về mục đích khảo sát"
              />
            </Form.Item>

            <Form.Item
              name="totalQuestions"
              label="Số câu hỏi"
              rules={[{ required: true, message: 'Vui lòng nhập số câu hỏi!' }]}
            >
              <Input type="number" min={1} placeholder="Số câu hỏi" />
            </Form.Item>

            <Form.Item
              name="autoSend"
              label="Tự động gửi sau sự kiện"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default SurveyManagementPage;
