
import { Button, Form, Input, Typography, Divider, message, Select } from "antd";
import styles from "./signUp.module.css";
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
    // Map form values to API keys
    const payload = {
      mssv: values.studentId,
      FirstName: values.firstName,
      LastName: values.lastName,
      Email: values.email,
      Password: values.password,
      UniversityName: values.university,
    };
    dispatch(registerUser(payload)).unwrap()
      .then(() => {
        message.success("Đăng ký thành công!");
        navigate("/signin");
      })
      .catch((err) => {
        message.error(err || "Đăng ký thất bại!");
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <Typography strong className={styles.back}
          onClick={() => navigate("/")}>
          {'< '}Quay về trang chủ
        </Typography>
        <Typography className={styles.brand}>UniTic</Typography>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <div className={styles.row}>
            <Form.Item name="lastName" rules={[{ required: true, message: "Vui lòng nhập họ!" }]}> 
              <Input placeholder="Họ" className={styles.mainInput} />
            </Form.Item>
            <Form.Item name="firstName" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}> 
              <Input placeholder="Tên" className={styles.mainInput} />
            </Form.Item>
            <Form.Item name="studentId" rules={[{ required: true, message: "Vui lòng nhập MSSV!" }]}> 
              <Input placeholder="MSSV" className={styles.mainInput} />
            </Form.Item>
          </div>
          <div className={styles.row}>
            <Form.Item name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không hợp lệ!" }]}> 
              <Input placeholder="Email" className={styles.mainInput} />
            </Form.Item>
            <Form.Item name="phone"> 
              <Input placeholder="Số điện thoại" className={styles.mainInput} />
            </Form.Item>
          </div>
          <div className={styles.row}>
            <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}> 
              <Input.Password placeholder="Mật khẩu" className={styles.mainInput} />
            </Form.Item>
            <Form.Item name="university" rules={[{ required: true, message: "Vui lòng chọn đại học!" }]}> 
              <Select 
                placeholder="Chọn đại học"
                className={styles.mainInput}
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
            className={styles.registerBtn}
          >
            Đăng ký
          </Button>
          <Divider plain>
            <span className={styles.divider}>HOẶC</span>
          </Divider>
          <Button type="default" block className={styles.ssoBtn}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GoogleIcon style={{ marginRight: 8 }} />
              Sign in as @fpt.edu.vn
            </span>
          </Button>
          <div className={styles.loginRow}>
            <span>Bạn đã có tài khoản?</span>
            <a onClick={() => navigate('/signin')} className={styles.loginLink}>
              Đăng nhập
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
