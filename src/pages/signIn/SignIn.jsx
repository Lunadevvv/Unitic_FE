import { Button, Checkbox, Form, Input, Typography, Divider, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styles from "./signin.module.css";
import GoogleIcon from "../../components/ui/GoogleIcon";
import { loginUser } from "../../store/actions/authActions";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  const [form] = Form.useForm();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <span className={styles.welcome}>
          Chào mừng bạn đến với <br />
          <span className={styles.brand}>UniTic</span>
        </span>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.formWrapper}>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Typography strong className={styles.back} 
            onClick={() => navigate("/")}
            >
              {'< '}Quay về trang chủ
            </Typography>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                placeholder="Email"
                className={styles.mainInput}
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
                className={styles.mainInput}
              />
            </Form.Item>
            <div className={styles.optionsRow}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className={styles.remember}>
                  Ghi nhớ đăng nhập
                </Checkbox>
              </Form.Item>
              <a className={styles.forgot} href="#">
                Quên mật khẩu?
              </a>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className={styles.loginBtn}
              >
                Đăng nhập
              </Button>
            </Form.Item>
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
            <div className={styles.signupRow}>
              <span>Bạn chưa có tài khoản?</span>
              <a onClick={()=>navigate('/signup')} className={styles.signupLink}>
                Đăng ký
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
