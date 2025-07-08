import React, { useState } from 'react';
import { 
  Card, Button, Form, Input, InputNumber, Space, 
  Popconfirm, Divider, Tag, Row, Col 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, DollarOutlined,
  TagsOutlined, NumberOutlined 
} from '@ant-design/icons';

const { TextArea } = Input;

const EventTicketTypeForm = ({ ticketTypes = [], onChange }) => {
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState(-1);

  const defaultTicketType = {
    name: '',
    price: 0,
    quantity: null,
    description: ''
  };

  const handleAddTicket = () => {
    form.validateFields().then(values => {
      const newTicketTypes = [...ticketTypes, values];
      onChange(newTicketTypes);
      form.resetFields();
      setEditingIndex(-1);
    }).catch(error => {
      console.log('Validation failed:', error);
    });
  };

  const handleEditTicket = (index) => {
    setEditingIndex(index);
    form.setFieldsValue(ticketTypes[index]);
  };

  const handleUpdateTicket = () => {
    form.validateFields().then(values => {
      const newTicketTypes = [...ticketTypes];
      newTicketTypes[editingIndex] = values;
      onChange(newTicketTypes);
      form.resetFields();
      setEditingIndex(-1);
    }).catch(error => {
      console.log('Validation failed:', error);
    });
  };

  const handleDeleteTicket = (index) => {
    const newTicketTypes = ticketTypes.filter((_, i) => i !== index);
    onChange(newTicketTypes);
    if (editingIndex === index) {
      form.resetFields();
      setEditingIndex(-1);
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleCancelEdit = () => {
    form.resetFields();
    setEditingIndex(-1);
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return `${price.toLocaleString('vi-VN')} VNĐ`;
  };

  return (
    <div className="event-ticket-type-form">
      <div className="ticket-types-list">
        {ticketTypes.length > 0 && (
          <Card size="small" title="Danh sách loại vé" className="tickets-list-card">
            <Row gutter={[16, 16]}>
              {ticketTypes.map((ticket, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card 
                    size="small" 
                    className={`ticket-item ${editingIndex === index ? 'editing' : ''}`}
                    actions={[
                      <Button 
                        type="text" 
                        size="small"
                        onClick={() => handleEditTicket(index)}
                        disabled={editingIndex !== -1 && editingIndex !== index}
                      >
                        Sửa
                      </Button>,
                      <Popconfirm
                        title="Bạn có chắc muốn xóa loại vé này?"
                        onConfirm={() => handleDeleteTicket(index)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button 
                          type="text" 
                          danger 
                          size="small"
                          disabled={editingIndex !== -1}
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    ]}
                  >
                    <div className="ticket-info">
                      <div className="ticket-name">
                        <TagsOutlined /> <strong>{ticket.name}</strong>
                      </div>
                      <div className="ticket-price">
                        <DollarOutlined /> {formatPrice(ticket.price)}
                      </div>
                      <div className="ticket-quantity">
                        <NumberOutlined /> Số lượng: {ticket.quantity || 'Không giới hạn'}
                      </div>
                      {ticket.description && (
                        <div className="ticket-description">
                          {ticket.description}
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </div>

      <Divider />

      <Card 
        size="small" 
        title={editingIndex >= 0 ? 'Chỉnh sửa loại vé' : 'Thêm loại vé mới'}
        className="ticket-form-card"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultTicketType}
        >
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="name"
                label="Tên loại vé"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên loại vé!' },
                  { max: 50, message: 'Tên loại vé không được quá 50 ký tự!' }
                ]}
              >
                <Input 
                  prefix={<TagsOutlined />}
                  placeholder="VD: Vé thường, Vé VIP, Early Bird..."
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="price"
                label="Giá vé (VNĐ)"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá vé!' },
                  { type: 'number', min: 0, message: 'Giá vé không được âm!' }
                ]}
              >
                <InputNumber
                  prefix={<DollarOutlined />}
                  placeholder="0"
                  min={0}
                  max={100000000}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="quantity"
                label="Số lượng vé"
                tooltip="Để trống nếu không giới hạn số lượng"
              >
                <InputNumber
                  prefix={<NumberOutlined />}
                  placeholder="Không giới hạn"
                  min={1}
                  max={10000}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả (không bắt buộc)"
          >
            <TextArea
              rows={3}
              placeholder="Mô tả chi tiết về loại vé này..."
              maxLength={200}
              showCount
            />
          </Form.Item>

          <div className="form-actions">
            <Space>
              {editingIndex >= 0 ? (
                <>
                  <Button onClick={handleCancelEdit}>
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={handleUpdateTicket}
                    icon={<TagsOutlined />}
                  >
                    Cập nhật loại vé
                  </Button>
                </>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handleAddTicket}
                  icon={<PlusOutlined />}
                >
                  Thêm loại vé
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>

      {ticketTypes.length === 0 && (
        <div className="empty-tickets">
          <div className="empty-content">
            <TagsOutlined className="empty-icon" />
            <p>Chưa có loại vé nào</p>
            <p className="empty-hint">Thêm ít nhất một loại vé để bán cho sự kiện</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTicketTypeForm;
