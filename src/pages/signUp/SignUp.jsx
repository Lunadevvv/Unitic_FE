
import { Button, Form, Input, Typography, Divider, message, Select } from "antd";
// import styles from "./signUp.module.css";
import GoogleIcon from "../../components/ui/GoogleIcon";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { registerUser } from "../../store/actions/authActions";
import { fetchUniversities } from "../../store/actions/universityActions";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { universities, loading: universitiesLoading } = useSelector(state => state.university);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchUniversities());
  }, [dispatch]);

  const handleSubmit = (values) => {
    // Map form values to API keys (all lowercase, match backend)
    const payload = {
      mssv: values.studentId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      universityName: values.university,
    };
    dispatch(registerUser(payload)).unwrap()
      .then(() => {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/signin");
      })
      .catch((err) => {
        message.error(err || "Đăng ký thất bại!");
      });
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
        maxWidth: 500,
        width: '100%'
      }}>
        <Typography style={{ color: '#2196f3', cursor: 'pointer', marginBottom: 16 }} strong onClick={() => navigate("/")}>{'< '}Quay về trang chủ</Typography>
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
            Đăng ký tài khoản mới
          </div>
        </div>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
            <Form.Item name="lastName" rules={[{ required: true, message: "Vui lòng nhập họ!" }]} style={{ flex: 1 }}>
              <Input placeholder="Họ" size="large" style={{ borderRadius: 8, borderColor: '#2196f3' }} />
            </Form.Item>
            <Form.Item name="firstName" rules={[{ required: true, message: "Vui lòng nhập tên!" }]} style={{ flex: 1 }}>
              <Input placeholder="Tên" size="large" style={{ borderRadius: 8, borderColor: '#2196f3' }} />
            </Form.Item>
            <Form.Item name="studentId" rules={[{ required: true, message: "Vui lòng nhập MSSV!" }]} style={{ flex: 1 }}>
              <Input placeholder="MSSV" size="large" style={{ borderRadius: 8, borderColor: '#2196f3' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
            <Form.Item name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không hợp lệ!" }]} style={{ flex: 1 }}>
              <Input placeholder="Email" size="large" style={{ borderRadius: 8, borderColor: '#2196f3' }} />
            </Form.Item>
            <Form.Item name="phone" style={{ flex: 1 }}>
              <Input placeholder="Số điện thoại" size="large" style={{ borderRadius: 8, borderColor: '#2196f3' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
            <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]} style={{ flex: 1 }}>
              <Input.Password placeholder="Mật khẩu" size="large" style={{ borderRadius: 8, borderColor: '#2196f3' }} />
            </Form.Item>
            <Form.Item name="university" rules={[{ required: true, message: "Vui lòng chọn đại học!" }]} style={{ flex: 1 }}>
              <Select
                placeholder="Chọn đại học"
                size="large"
                style={{ borderRadius: 8, borderColor: '#2196f3' }}
                loading={universitiesLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {universities?.map((university) => (
                  <Select.Option key={university.id} value={university.name}>
                    {university.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{
              background: 'linear-gradient(90deg, #2196f3 0%, #8ecae6 100%)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              marginTop: 8
            }}
          >
            Đăng ký
          </Button>
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
            <span>Bạn đã có tài khoản?</span>
            <a onClick={() => navigate('/signin')} style={{ color: '#2196f3', marginLeft: 8, fontWeight: 600, cursor: 'pointer' }}>
              Đăng nhập
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
