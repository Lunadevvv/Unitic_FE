import React, { useState } from 'react';
import { Upload, message, Card, Button, Space } from 'antd';
import { 
  PlusOutlined, DeleteOutlined, EyeOutlined, 
  CameraOutlined, CloudUploadOutlined 
} from '@ant-design/icons';

const EventUploadImage = ({ imageUrl, onImageChange }) => {
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ được upload file JPG/PNG!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return false;
    }
    
    return true;
  };

  const handleUpload = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      // Simulate successful upload
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setLoading(false);
        onImageChange(reader.result);
        message.success('Upload ảnh thành công!');
      });
      reader.readAsDataURL(info.file.originFileObj);
    }
    
    if (info.file.status === 'error') {
      setLoading(false);
      message.error('Upload ảnh thất bại!');
    }
  };

  const handleRemove = () => {
    onImageChange('');
    message.success('Đã xóa ảnh!');
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  // Custom upload request - simulate upload
  const customRequest = ({ onSuccess, onError }) => {
    setTimeout(() => {
      try {
        onSuccess('ok');
      } catch (error) {
        onError(error);
      }
    }, 1000);
  };

  const uploadButton = (
    <div className="upload-content">
      <div className="upload-icon">
        {loading ? <CloudUploadOutlined spin /> : <CameraOutlined />}
      </div>
      <div className="upload-text">
        {loading ? 'Đang upload...' : 'Chọn ảnh'}
      </div>
      <div className="upload-hint">
        Định dạng JPG, PNG • Tối đa 2MB
      </div>
    </div>
  );

  return (
    <div className="event-upload-image">
      {!imageUrl ? (
        <Upload
          name="eventImage"
          listType="picture-card"
          className="image-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleUpload}
          customRequest={customRequest}
        >
          {uploadButton}
        </Upload>
      ) : (
        <div className="image-preview-container">
          <Card className="image-preview-card">
            <div className="image-wrapper">
              <img src={imageUrl} alt="Event" className="preview-image" />
              <div className="image-overlay">
                <Space>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                    className="overlay-button"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleRemove}
                    className="overlay-button"
                  />
                </Space>
              </div>
            </div>
            <div className="image-actions">
              <Upload
                name="eventImage"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleUpload}
                customRequest={customRequest}
              >
                <Button icon={<PlusOutlined />} loading={loading}>
                  Thay đổi ảnh
                </Button>
              </Upload>
            </div>
          </Card>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewVisible && (
        <div 
          className="image-preview-modal"
          onClick={() => setPreviewVisible(false)}
        >
          <div className="preview-content">
            <img src={imageUrl} alt="Preview" />
            <Button 
              className="close-button"
              icon={<DeleteOutlined />}
              onClick={() => setPreviewVisible(false)}
            />
          </div>
        </div>
      )}

      <div className="upload-guidelines">
        <h4>Hướng dẫn chọn ảnh:</h4>
        <ul>
          <li>Kích thước khuyến nghị: 1200x600px (tỷ lệ 2:1)</li>
          <li>Định dạng: JPG, PNG</li>
          <li>Dung lượng tối đa: 2MB</li>
          <li>Ảnh rõ nét, có liên quan đến nội dung sự kiện</li>
        </ul>
      </div>
    </div>
  );
};

export default EventUploadImage;
