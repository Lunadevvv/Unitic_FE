import { Button, Checkbox, Form, Input, Typography, Divider } from "antd";
import styles from "./signin.module.css";

function SignIn() {
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
          <Form layout="vertical">
            <Typography strong className={styles.back}>
              Quay về trang chủ
            </Typography>
            <Input
              placeholder="Email"
              name="email"
              className={styles.mainInput}
            />
            <Input.Password
              placeholder="Mật khẩu"
              name="password"
              className={styles.mainInput}
            />
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
                className={styles.loginBtn}
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <Divider plain>
              <span className={styles.divider}>HOẶC</span>
            </Divider>
            <Button type="default" block className={styles.ssoBtn}>
              Sign in as example@fpt.edu.vn
            </Button>
            <div className={styles.signupRow}>
              <span>Bạn chưa có tài khoản?</span>
              <a href="#" className={styles.signupLink}>
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
