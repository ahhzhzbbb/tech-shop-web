import { Modal, Form, Input, Button } from "antd";

const RegisterModal = ({ open, onCancel }) => {
    return (
        <Modal
            title="Đăng ký tài khoản"
            open={open}
            onCancel={onCancel}
            footer={null} // bỏ nút default
            centered
        >
            <Form layout="vertical">
                <Form.Item label="Họ tên">
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item label="Email">
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item label="Số điện thoại">
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item label="Mật khẩu">
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item label="Xác nhận mật khẩu">
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <Button type="primary" block>
                    Đăng ký
                </Button>
            </Form>
        </Modal>
    );
};

export default RegisterModal;