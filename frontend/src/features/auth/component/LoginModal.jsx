import { Modal, Form, Input, Button, message } from "antd";
import { useLogin } from "../hooks/useAuth";

const LoginModal = ({ open, onCancel }) => {
  const { login, loading } = useLogin();
  const form = Form.useForm();

  const handleLogin = async (values) => {
    try {
      await login(values);
      message.success("Đăng nhập thành công");
      form.resetFields();
      onclose();
    } catch {
      message.error(err?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <Modal title="Đăng nhập tài khoản" open={open} onCancel={onCancel} footer={null} centered >
      <Form layout="vertical" form={form} onFinish={handleLogin}>
        {/* USERNAME */}
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng kí" },
            { min: 3, max: 20, message: "Tên đăng kí có 3-20 kí tự" },
          ]}>
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>

        {/* PASSWORD */}
        <Form.Item>
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        {/* FORGOT */}
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <a
            href="/"
            style={{ color: "#666", textDecoration: "underline", fontSize: 14 }}
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* BUTTON */}
        <Button
          type="primary"
          block
          style={{
            background: "#ff002b",
            borderColor: "#ff002b",
            height: 44,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          Đăng nhập
        </Button>

        {/* REGISTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            color: "#666",
            fontSize: 15,
          }}
        >
          Bạn chưa có tài khoản?{" "}
          <a href="/" style={{ color: "#1677ff" }}>
            Đăng ký ngay!
          </a>
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal;
