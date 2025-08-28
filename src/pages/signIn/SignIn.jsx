import { Button, Checkbox, Form, Input, Typography, Divider, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "./signin.module.css";
import GoogleIcon from "../../components/ui/GoogleIcon";
import { loginUser } from "../../store/actions/authActions";
import { ROLES } from "../../utils/rolePermissions";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    // Redirect based on role after authentication
    if (isAuthenticated && user) {
      // Điều hướng dựa trên role
      if (user.role === ROLES.ADMIN || user.role === ROLES.MODERATOR || user.role === ROLES.STAFF) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Show error message if login fails
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSubmit = async (values) => {
    dispatch(loginUser({
      Email: values.email,
      Password: values.password
    }));
  };
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2196f3 0%, #8ecae6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
        padding: 40,
        minWidth: 350,
        maxWidth: 400,
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{
            fontWeight: 700,
            fontSize: 28,
            color: '#2196f3',
            letterSpacing: 1
          }}>
            UniTic
          </span>
          <div style={{ color: '#666', fontSize: 16, marginTop: 8 }}>
            Đăng nhập tài khoản
          </div>
        </div>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Typography style={{ color: '#2196f3', cursor: 'pointer', marginBottom: 16 }} strong onClick={() => navigate("/")}>{'< '}Quay về trang chủ</Typography>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              placeholder="Email"
              size="large"
              style={{ borderRadius: 8, borderColor: '#2196f3' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' }
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              size="large"
              style={{ borderRadius: 8, borderColor: '#2196f3' }}
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#2196f3' }}>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a style={{ color: '#2196f3' }} href="#">Quên mật khẩu?</a>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              style={{
                background: 'linear-gradient(90deg, #2196f3 0%, #8ecae6 100%)',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <Divider plain>
            <span style={{ color: '#2196f3' }}>HOẶC</span>
          </Divider>
          <Button type="default" block size="large" style={{ borderRadius: 8, borderColor: '#2196f3', color: '#2196f3', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GoogleIcon style={{ marginRight: 8 }} />
              Sign in as @fpt.edu.vn
            </span>
          </Button>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span>Bạn chưa có tài khoản?</span>
            <a onClick={() => navigate('/signup')} style={{ color: '#2196f3', marginLeft: 8, fontWeight: 600, cursor: 'pointer' }}>
              Đăng ký
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default SignIn;
