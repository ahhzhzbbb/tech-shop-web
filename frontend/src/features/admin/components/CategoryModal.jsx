import { useEffect } from "react";
import { Modal, Form, Input, Switch } from "antd";
import "./CategoryModal.scss";

// =========================================
// Props:
//   open         — boolean, hiển thị modal
//   onClose      — fn, đóng modal
//   onSubmit     — fn(values) => Promise, gọi API tạo/cập nhật
//   editingItem  — object | null (null = tạo mới)
//   confirmLoading — boolean
// =========================================
export default function CategoryModal({
    open,
    onClose,
    onSubmit,
    editingItem,
    confirmLoading,
}) {
    const [form] = Form.useForm();
    const isEditing = !!editingItem;

    // Điền sẵn dữ liệu khi mở modal
    useEffect(() => {
        if (open) {
            if (isEditing) {
                form.setFieldsValue({
                    name: editingItem.name,
                    active: editingItem.active ?? true,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ active: true });
            }
        }
    }, [open, editingItem]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
        } catch (err) {
            // Nếu là lỗi validate của Form thì giữ modal mở
            if (err?.errorFields) return;
            throw err;
        }
    };

    return (
        <Modal
            title={
                <span className="cm-title">
                    {isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                </span>
            }
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            confirmLoading={confirmLoading}
            okText={isEditing ? "Lưu thay đổi" : "Thêm"}
            cancelText="Huỷ"
            okButtonProps={{ className: "cm-btn-ok" }}
            destroyOnClose
        >
            <Form form={form} layout="vertical" className="cm-form">
                <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
                >
                    <Input placeholder="Ví dụ: Laptop, Chuột, Bàn phím..." />
                </Form.Item>
                <Form.Item name="active" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
                </Form.Item>
            </Form>
        </Modal>
    );
}