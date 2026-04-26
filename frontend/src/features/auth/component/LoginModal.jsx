import { Modal, Form, Input, Button, message } from "antd";
import { useLogin } from "../hooks/useAuth";
import { useAuthContext } from "../../../context/AuthContext";

const LoginModal = ({ open, onCancel }) => {
  const { login, loading } = useLogin();
  const [form] = Form.useForm();
  const { user, setUser } = useAuthContext();

  export const getLoginErrorMessage = (err) => {
    const status = err?.status;
    const message = err?.message;

    if (status === 401) {
      return "Thông tin đăng nhập không đúng, vui lòng thử lại";
    }

    if (status === 400) {
      return "Vui lòng nhập đầy đủ thông tin";
    }

    if (status === 403) {
      return "Tài khoản của bạn đã bị khóa";
    }

    if (status === 500) {
      return "Hệ thống đang gặp sự cố, vui lòng thử lại sau";
    }

    if (!status) {
      return "Lỗi đường truyền, không thể kết nối tới máy chủ";
    }

    return message || "Đăng nhập thất bại";
  };

  const handleLogin = async (values) => {
    try {
      const res = await login(values);
      setUser({
        username: res?.username,
        phoneNumber: res?.phoneNumber,
      })
      message.success("Đăng nhập thành công");
      form.resetFields();
      onCancel();
    } catch (err) {
      message.error(getLoginErrorMessage(err));
    }
  };

  return (
    <Modal title="Đăng nhập tài khoản" open={open} onCancel={onCancel} footer={null} centered >
      <Form layout="vertical" form={form} onFinish={handleLogin}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}>
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Button type="primary" block htmlType="submit" loading={loading}
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
