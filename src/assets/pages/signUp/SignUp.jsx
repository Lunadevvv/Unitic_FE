import { Button, Form, Input, Typography, Divider } from "antd";
import styles from "./signUp.module.css";
import GoogleIcon from "../../components/ui/GoogleIcon";
import { useNavigate } from "react-router-dom";

function SignUp() {
   const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <Typography strong className={styles.back}
          onClick={() => navigate("/signin")}>
          {'< '}Quay về đăng nhập
        </Typography>
        <Typography className={styles.brand}>UniTic</Typography>
        <Form layout="vertical">
          <div className={styles.row}>
            <Input
              placeholder="Họ"
              name="lastName"
              className={styles.mainInput}
            />
            <Input
              placeholder="Tên"
              name="firstName"
              className={styles.mainInput}
            />
            <Input
              placeholder="MSSV"
              name="studentId"
              className={styles.mainInput}
            />
          </div>
          <div className={styles.row}>
            <Input
              placeholder="Email"
              name="email"
              className={styles.mainInput}
            />
            <Input
              placeholder="Số điện thoại"
              name="phone"
              className={styles.mainInput}
            />
          </div>
          <div className={styles.row}>
            <Input.Password
              placeholder="Mật khẩu"
              name="password"
              className={styles.mainInput}
            />
            <select
              name="university"
              className={styles.mainInput}
              defaultValue=""
            >
              <option value="" disabled>Chọn đại học</option>
              <option value="fpt">FPT University</option>
              <option value="hust">Đại học Bách Khoa Hà Nội</option>
              <option value="vnu">Đại học Quốc gia Hà Nội</option>
              <option value="hcmus">Đại học Khoa học Tự nhiên TP.HCM</option>
              <option value="other">Khác</option>
            </select>
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
            <a href="#" className={styles.loginLink}>
              Đăng nhập
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
