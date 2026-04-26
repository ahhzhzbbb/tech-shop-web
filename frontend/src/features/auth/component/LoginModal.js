import { Modal, Form, Input, Button } from "antd";

const LoginModal = ({ open, onCancel }) => {
  return (
    <Modal
      title="Đăng nhập tài khoản"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <Form layout="vertical">
        {/* USERNAME */}
        <Form.Item>
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
