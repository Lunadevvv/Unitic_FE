import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Form, Input, Select, DatePicker, TimePicker, InputNumber, 
  Card, Row, Col, Button, Switch, Divider, Space 
} from 'antd';
import { 
  CalendarOutlined, EnvironmentOutlined, TikTokOutlined,
  DollarOutlined, FileTextOutlined, TagsOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { fetchCategories } from '../../store/actions/categoryActions';
import { formatDateForAPI } from '../../utils/dateUtils';
import EventUploadImage from './EventUploadImage';
import EventTicketTypeForm from './EventTicketTypeForm';

const { TextArea } = Input;
const { Option } = Select;

const OrganizationEventForm = ({ initialData = {}, onSubmit }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.category);
  const [form] = Form.useForm();
  const [hasTickets, setHasTickets] = useState(initialData.hasTickets || false);
  const [ticketTypes, setTicketTypes] = useState(initialData.ticketTypes || []);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  const handleFormSubmit = (values) => {
    // Always use price from form input
    const formData = {
      name: values.title,
      image: imageUrl || "https://example.com/images/default_event.jpg",
      description: values.description,
      date_Start: formatDateForAPI(values.startDate),
      date_End: formatDateForAPI(values.endDate),
      price: values.price || 0, // Ensure price is a number
      cateID: values.category,
      slot: values.maxAttendees || 0,
      location: values.location,
      hasTickets,
      ticketTypes: hasTickets ? ticketTypes : [],
      imageUrl,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    onSubmit(formData);
  };


  // Set initial form values
  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      form.setFieldsValue({
        ...initialData,
        startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
        endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
      });
      setHasTickets(initialData.hasTickets || false);
      setTicketTypes(initialData.ticketTypes || []);
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData, form]);

  return (
    <div className="organization-event-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          type: 'seminar',
          maxAttendees: 50,
          isPublic: true,
          hasTickets: false
        }}
      >
        <Card title="Thông tin cơ bản" className="form-section">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="title"
                label="Tên sự kiện"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên sự kiện!' },
                  { max: 100, message: 'Tên sự kiện không được quá 100 ký tự!' }
                ]}
              >
                <Input 
                  prefix={<FileTextOutlined />}
                  placeholder="VD: Workshop UX/UI Design cho người mới bắt đầu"
                  showCount
                  maxLength={100}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả ngắn"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả!' },
              { max: 200, message: 'Mô tả ngắn không được quá 200 ký tự!' }
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Mô tả ngắn gọn về sự kiện..."
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="longDescription"
            label="Mô tả chi tiết"
            rules={[{ max: 1000, message: 'Mô tả chi tiết không được quá 1000 ký tự!' }]}
          >
            <TextArea
              rows={6}
              placeholder="Mô tả chi tiết về chương trình, diễn giả, nội dung..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục" showSearch>
                  {categories?.map(category => (
                    <Option key={category.cateID} value={category.cateID}>
                      <TagsOutlined /> {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="organizer"
                label="Tên tổ chức"
                rules={[{ required: true, message: 'Vui lòng nhập tên tổ chức!' }]}
              >
                <Input placeholder="VD: FPT Software" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Thời gian và địa điểm" className="form-section">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="startDate"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày và giờ"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="endDate"
                label="Thời gian kết thúc"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn ngày và giờ"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} lg={16}>
              <Form.Item
                name="location"
                label="Địa điểm"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
              >
                <Input 
                  prefix={<EnvironmentOutlined />}
                  placeholder="VD: Tòa nhà FPT, 17 Duy Tân, Cầu Giấy, Hà Nội"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item
                name="maxAttendees"
                label="Số lượng tối đa"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng!' },
                  { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }
                ]}
              >
                <InputNumber
                  prefix={<TikTokOutlined />}
                  placeholder="50"
                  min={1}
                  max={10000}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Ảnh đại diện" className="form-section">
          <EventUploadImage 
            imageUrl={imageUrl}
            onImageChange={setImageUrl}
          />
        </Card>

        <Card title="Cài đặt bán vé" className="form-section">
          <Form.Item
            name="price"
            label="Giá vé (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá vé!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="Nhập giá vé, 0 nếu miễn phí"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|,*/g, '')}
            />
          </Form.Item>
        </Card>

        <Card title="Cài đặt khác" className="form-section">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="isPublic"
                label="Công khai sự kiện"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Công khai"
                  unCheckedChildren="Riêng tư"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="allowRegistration"
                label="Cho phép đăng ký"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch 
                  checkedChildren="Cho phép"
                  unCheckedChildren="Tạm khóa"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="note"
            label="Ghi chú cho admin"
          >
            <TextArea
              rows={3}
              placeholder="Ghi chú hoặc yêu cầu đặc biệt..."
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Card>

        <div className="form-actions">
          <Space size="large">
            <Button size="large">
              Lưu nháp
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              icon={<CalendarOutlined />}
            >
              Tiếp tục
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default OrganizationEventForm;
