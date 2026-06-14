import { useEffect, useMemo, useState } from "react";
import {
    Button,
    Input,
    Table,
    Tag,
    Popconfirm,
    Typography,
    Space,
    message,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { PencilSimpleIcon, TrashIcon, ListBulletsIcon } from "@phosphor-icons/react";
import categoryApi from "./categoryApi";
import CategoryModal from "../components/CategoryModal";
import CategoryAttributesDrawer from "../components/CategoryAttributesDrawer";
import useCategoryStore from "../../../store/categoryStore";
import "./AdminCategories.scss";

const { Title, Text } = Typography;

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [attributesDrawerOpen, setAttributesDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const refreshCategoryStore = useCategoryStore((s) => s.fetchCategories);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryApi.getCategories(true);
            setCategories(data.categories || []);
        } catch {
            messageApi.error("Không thể tải danh mục.");
        } finally {
            setLoading(false);
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchCategories(); }, []);

    const openCreate = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEdit = (record) => {
        setEditingItem(record);
        setModalOpen(true);
    };

    const openAttributes = (record) => {
        if (record.id == null) {
            messageApi.error("Không tìm thấy ID danh mục. Vui lòng tải lại trang.");
            return;
        }
        setSelectedCategory(record);
        setAttributesDrawerOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const closeAttributesDrawer = () => {
        setAttributesDrawerOpen(false);
        setSelectedCategory(null);
    };

    const filteredCategories = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        if (!normalizedKeyword) return categories;

        return categories.filter((category) =>
            category.name?.toLowerCase().includes(normalizedKeyword)
        );
    }, [categories, keyword]);

    const metrics = useMemo(() => {
        const active = categories.filter((category) => category.active !== false).length;
        return {
            total: categories.length,
            active,
            hidden: categories.length - active,
        };
    }, [categories]);

    const handleSubmit = async (values) => {
        setConfirmLoading(true);
        try {
            if (editingItem) {
                if (editingItem.id == null) {
                    messageApi.error("Không tìm thấy ID danh mục. Vui lòng tải lại trang.");
                    return;
                }
                await categoryApi.updateCategory(editingItem.id, values);
                messageApi.success("Cập nhật danh mục thành công.");
            } else {
                await categoryApi.createCategory(values);
                messageApi.success("Thêm danh mục thành công.");
            }
            closeModal();
            fetchCategories();
            refreshCategoryStore(true); // đồng bộ store dùng chung
        } catch {
            messageApi.error("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleDelete = async (record) => {
        if (record.id == null) {
            messageApi.error("Không tìm thấy ID danh mục. Vui lòng tải lại trang.");
            return;
        }

        try {
            await categoryApi.deleteCategory(record.id);
            messageApi.success(`Đã xoá danh mục "${record.name}".`);
            fetchCategories();
            refreshCategoryStore(true); // đồng bộ store dùng chung
        } catch {
            messageApi.error("Xoá thất bại, vui lòng thử lại.");
        }
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            width: 64,
            render: (_, __, index) => (
                <Text className="ac-index">{index + 1}</Text>
            ),
        },
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
            render: (name) => <Text className="ac-name">{name}</Text>,
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            key: "active",
            width: 130,
            render: (active) =>
                active !== undefined ? (
                    <Tag color={active ? "success" : "default"}>
                        {active ? "Hoạt động" : "Ẩn"}
                    </Tag>
                ) : null,
        },
        {
            title: "Hành động",
            key: "actions",
            width: 280,
            align: "center",
            render: (_, record) => (
                <Space size={8} wrap>
                    <Button
                        className="ac-btn-attributes"
                        icon={<ListBulletsIcon size={15} weight="bold" />}
                        size="small"
                        onClick={() => openAttributes(record)}
                    >
                        Thuộc tính
                    </Button>

                    <Button
                        className="ac-btn-edit"
                        icon={<PencilSimpleIcon size={15} weight="bold" />}
                        size="small"
                        onClick={() => openEdit(record)} />

                    <Popconfirm
                        title="Xoá danh mục?"
                        description={`Bạn có chắc muốn xoá "${record.name}" không?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true }}
                    >

                        <Button
                            className="ac-btn-delete"
                            icon={<TrashIcon size={15} weight="bold" />}
                            size="small"
                            danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="ac-page">
            {contextHolder}
            <div className="ac-header">
                <div>
                    <Title level={3} className="ac-title">Quản lý danh mục</Title>
                    <Text className="ac-subtitle">Quản lý danh mục và bộ thuộc tính kỹ thuật</Text>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="ac-btn-add"
                    onClick={openCreate}
                >
                    Thêm danh mục
                </Button>
            </div>

            <div className="ac-metrics">
                <div className="ac-metric">
                    <span>Tổng danh mục</span>
                    <strong>{metrics.total}</strong>
                </div>
                <div className="ac-metric">
                    <span>Hoạt động</span>
                    <strong>{metrics.active}</strong>
                </div>
                <div className="ac-metric">
                    <span>Đang ẩn</span>
                    <strong>{metrics.hidden}</strong>
                </div>
            </div>

            <div className="ac-toolbar">
                <Input
                    className="ac-search"
                    prefix={<SearchOutlined />}
                    placeholder="Tìm danh mục"
                    allowClear
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
            </div>

            <div className="ac-table-wrap">
                <Table
                    dataSource={filteredCategories}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: false,
                        showTotal: (total) => `${total} danh mục`,
                    }}
                    className="ac-table"
                />
            </div>

            <CategoryModal
                open={modalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                editingItem={editingItem}
                confirmLoading={confirmLoading}
            />

            <CategoryAttributesDrawer
                open={attributesDrawerOpen}
                category={selectedCategory}
                onClose={closeAttributesDrawer}
            />
        </div>
    );
}
