import { Modal, Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useRegister } from "../hooks/useAuth";

const RegisterModal = ({ open, onCancel }) => {
    const { register, loading } = useRegister();
    const [form] = Form.useForm();

    const handleRegister = async (values) => {
        try {
            await register(values);
            message.success("Đăng kí thành công");
            form.resetFields();
            onclose();
        } catch (err) {
            message.error(err?.message || "Đăng kí thất bại");
        }
    };

    return (
        <Modal title="Đăng ký tài khoản" open={open} onCancel={onCancel} footer={null} centered >
            <Form layout="vertical" form={form} onFinish={handleRegister}>
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên đăng kí" },
                        { min: 3, message: "Tên đăng kí có 3-20 kí tự" },
                        { max: 20, message: "Tên đăng kí có 3-20 kí tự" }
                    ]}>
                    <Input placeholder="Tên đăng ký" required />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại" },
                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải đúng 10 chữ số', }
                    ]}>
                    <Input placeholder="Số điện thoại" required />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu" },
                        { min: 6, message: "Mật khẩu cần có 6 - 40 kí tự" },
                        { max: 40, message: "Mật khẩu cần có 6 - 40 kí tự" },
                    ]}>
                    <Input.Password placeholder="Mật khẩu" required />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Vui lòng xác nhận mật khẩu" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject("Mật khẩu không khớp");
                            },
                        }),
                    ]}>
                    <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>

                <Button type="primary" block htmlType="submit" loading={loading}
                    style={{
                        background: "#ff002b",
                        borderColor: "#ff002b",
                        height: 44,
                        fontWeight: 700,
                        fontSize: 16,
                    }}>
                    Đăng ký
                </Button>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: 18,
                        color: "#666",
                        fontSize: 15,
                    }}
                >
                    Bạn đã có tài khoản?{" "}
                    <a href="/" style={{ color: "#1677ff" }}>
                        Đăng nhập ngay!
                    </a>
                </div>
            </Form>
        </Modal>
    );
};

export default RegisterModal;