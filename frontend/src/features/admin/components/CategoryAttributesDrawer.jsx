import { useCallback, useEffect, useState } from "react";
import {
    Button,
    Drawer,
    Empty,
    Popconfirm,
    Space,
    Spin,
    Table,
    Typography,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";

import categoryApi from "../category/categoryApi";
import AttributeModal from "./AttributeModal";
import "./CategoryAttributesDrawer.scss";

const { Text, Title } = Typography;

export default function CategoryAttributesDrawer({ open, category, onClose }) {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchAttributes = useCallback(async () => {
        if (!category?.id) return;

        setLoading(true);
        try {
            const data = await categoryApi.getAttributesByCategory(category.id);
            setAttributes(data.attributes || []);
        } catch {
            messageApi.error("Không thể tải thuộc tính.");
        } finally {
            setLoading(false);
        }
    }, [category?.id, messageApi]);

    useEffect(() => {
        if (open && category?.id) {
            fetchAttributes();
        } else if (!open) {
            setAttributes([]);
            setEditingItem(null);
            setModalOpen(false);
        }
    }, [open, category?.id, fetchAttributes]);

    const openCreate = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEdit = (record) => {
        setEditingItem(record);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const handleSubmit = async (values) => {
        if (!category?.id) return;

        setConfirmLoading(true);
        try {
            const payload = {
                name: values.name,
                categoryId: category.id,
            };

            if (editingItem) {
                await categoryApi.updateAttribute(editingItem.id, payload);
                messageApi.success("Cập nhật thuộc tính thành công.");
            } else {
                await categoryApi.createAttribute(payload);
                messageApi.success("Thêm thuộc tính thành công.");
            }

            closeModal();
            fetchAttributes();
        } catch {
            messageApi.error("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleDelete = async (record) => {
        try {
            await categoryApi.deleteAttribute(record.id);
            messageApi.success(`Đã xoá thuộc tính "${record.name}".`);
            fetchAttributes();
        } catch {
            messageApi.error("Xoá thất bại, vui lòng thử lại.");
        }
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            width: 56,
            render: (_, __, index) => <Text className="cad-index">{index + 1}</Text>,
        },
        {
            title: "Tên thuộc tính",
            dataIndex: "name",
            key: "name",
            render: (name) => <Text className="cad-name">{name}</Text>,
        },
        {
            title: "Hành động",
            key: "actions",
            width: 140,
            align: "right",
            render: (_, record) => (
                <Space size={8}>
                    <Button
                        className="cad-btn-edit"
                        icon={<PencilSimpleIcon size={15} weight="bold" />}
                        size="small"
                        onClick={() => openEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xoá thuộc tính?"
                        description={`Bạn có chắc muốn xoá "${record.name}" không?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            className="cad-btn-delete"
                            icon={<TrashIcon size={15} weight="bold" />}
                            size="small"
                            danger
                        >
                            Xoá
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Drawer
                title={
                    <div className="cad-drawer-title">
                        <Title level={4} className="cad-title">
                            Thuộc tính danh mục
                        </Title>
                        {category?.name && (
                            <Text className="cad-subtitle">{category.name}</Text>
                        )}
                    </div>
                }
                placement="right"
                width={560}
                open={open}
                onClose={onClose}
                destroyOnClose
                className="cad-drawer"
            >
                <div className="cad-toolbar">
                    <Text className="cad-count">{attributes.length} thuộc tính</Text>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="cad-btn-add"
                        onClick={openCreate}
                        disabled={!category?.id}
                    >
                        Thêm thuộc tính
                    </Button>
                </div>

                <Spin spinning={loading}>
                    <div className="cad-table-wrap">
                        {attributes.length === 0 && !loading ? (
                            <Empty
                                className="cad-empty"
                                description="Chưa có thuộc tính nào"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <Table
                                dataSource={attributes}
                                columns={columns}
                                rowKey="id"
                                pagination={{ pageSize: 8, showSizeChanger: false }}
                                className="cad-table"
                                size="middle"
                            />
                        )}
                    </div>
                </Spin>

                <AttributeModal
                    open={modalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    editingItem={editingItem}
                    categoryName={category?.name}
                    confirmLoading={confirmLoading}
                />
            </Drawer>
        </>
    );
}
