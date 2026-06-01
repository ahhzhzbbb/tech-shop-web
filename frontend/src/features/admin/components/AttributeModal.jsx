import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import "./AttributeModal.scss";

export default function AttributeModal({
    open,
    onClose,
    onSubmit,
    editingItem,
    categoryName,
    confirmLoading,
}) {
    const [form] = Form.useForm();
    const isEditing = !!editingItem;

    useEffect(() => {
        if (open) {
            if (isEditing) {
                form.setFieldsValue({ name: editingItem.name });
            } else {
                form.resetFields();
            }
        }
    }, [open, editingItem, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
        } catch (err) {
            if (err?.errorFields) return;
            throw err;
        }
    };

    return (
        <Modal
            title={
                <span className="am-title">
                    {isEditing ? "Chỉnh sửa thuộc tính" : "Thêm thuộc tính mới"}
                </span>
            }
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            confirmLoading={confirmLoading}
            okText={isEditing ? "Lưu thay đổi" : "Thêm"}
            cancelText="Huỷ"
            okButtonProps={{ className: "am-btn-ok" }}
            destroyOnClose
        >
            {categoryName && (
                <p className="am-category-hint">
                    Danh mục: <strong>{categoryName}</strong>
                </p>
            )}
            <Form form={form} layout="vertical" className="am-form">
                <Form.Item
                    name="name"
                    label="Tên thuộc tính"
                    rules={[{ required: true, message: "Vui lòng nhập tên thuộc tính" }]}
                >
                    <Input placeholder="Ví dụ: RAM, CPU, Màn hình..." />
                </Form.Item>
            </Form>
        </Modal>
    );
}
