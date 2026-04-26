import { Modal, Form, Input, Button, message } from "antd";
import { useLogin } from "../hooks/useAuth";
import { useAuthContext } from "../../../context/AuthContext";

const LoginModal = ({ open, onCancel, onOpenRegister }) => {
  const { login, loading } = useLogin();
  const [form] = Form.useForm();
  const { user, setUser } = useAuthContext();

  const getErrorMessage = (err) => {
    const status = err?.status;
    const errorMessage = err?.message;

    if (status === 401) {
      return "Thông tin không đúng, vui lòng thử lại";
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

    return errorMessage || "Đăng nhập thất bại";
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
      message.error(getErrorMessage(err));
    }
  };

  const handleSwitchToRegister = () => {
    form.resetFields();
    onCancel();
    if (onOpenRegister) {
      onOpenRegister();
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
          <a
            onClick={handleSwitchToRegister}
            style={{ color: "#1677ff", cursor: "pointer" }}
          >
            Đăng ký ngay!
          </a>
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal;
