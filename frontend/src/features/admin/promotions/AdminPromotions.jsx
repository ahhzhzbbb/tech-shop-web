import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    Drawer,
    Empty,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
} from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import promotionApi from "../products/promotionApi";
import { fetchAllProducts } from "../utils/adminData";
import {
    formatCurrency,
    formatDateTime,
    formatNumber,
    toDateTimeInputValue,
    toLocalDateTimePayload,
} from "../utils/adminFormat";
import "./AdminPromotions.scss";

const { Title, Text } = Typography;

const getErrorText = (error, fallback) =>
    error?.response?.data?.message || error?.response?.data || fallback;

const getPromotionState = (promotion) => {
    const now = Date.now();
    const startTime = promotion.startDate ? new Date(promotion.startDate).getTime() : null;
    const endTime = promotion.endDate ? new Date(promotion.endDate).getTime() : null;

    if (startTime && now < startTime) {
        return { label: "Sắp diễn ra", color: "blue" };
    }

    if (endTime && now > endTime) {
        return { label: "Hết hạn", color: "default" };
    }

    return { label: "Đang áp dụng", color: "green" };
};

export default function AdminPromotions() {
    const [form] = Form.useForm();
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const isEditing = !!editingItem;

    const productById = useMemo(() => {
        const map = new Map();
        products.forEach((product) => map.set(product.id, product));
        return map;
    }, [products]);

    const usedProductIds = useMemo(() => {
        return new Set(
            promotions
                .filter((promotion) => promotion.id !== editingItem?.id)
                .map((promotion) => promotion.productId)
        );
    }, [editingItem?.id, promotions]);

    const productOptions = useMemo(() => {
        return products
            .filter((product) => !usedProductIds.has(product.id))
            .map((product) => ({
                label: `${product.name} - ${formatCurrency(product.price)}`,
                value: product.id,
            }));
    }, [products, usedProductIds]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [promotionData, productList] = await Promise.all([
                promotionApi.getAllPromotions(),
                fetchAllProducts(),
            ]);
            setPromotions(promotionData.promotionItems || []);
            setProducts(productList);
        } catch (error) {
            messageApi.error(getErrorText(error, "Không thể tải danh sách khuyến mãi."));
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!drawerOpen) return;

        if (editingItem) {
            form.setFieldsValue({
                productId: editingItem.productId,
                discountPercent: editingItem.discountPercent,
                startDate: toDateTimeInputValue(editingItem.startDate),
                endDate: toDateTimeInputValue(editingItem.endDate),
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ discountPercent: 10 });
        }
    }, [drawerOpen, editingItem, form]);

    const filteredPromotions = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        if (!normalizedKeyword) return promotions;

        return promotions.filter((promotion) => {
            const product = productById.get(promotion.productId);
            const productName = (promotion.productName || product?.name || "").toLowerCase();

            return (
                `${promotion.id}`.includes(normalizedKeyword) ||
                `${promotion.productId}`.includes(normalizedKeyword) ||
                productName.includes(normalizedKeyword)
            );
        });
    }, [keyword, productById, promotions]);

    const metrics = useMemo(() => {
        const active = promotions.filter((promotion) => getPromotionState(promotion).label === "Đang áp dụng").length;
        const expired = promotions.filter((promotion) => getPromotionState(promotion).label === "Hết hạn").length;
        const avgDiscount =
            promotions.length === 0
                ? 0
                : promotions.reduce((sum, item) => sum + (Number(item.discountPercent) || 0), 0) / promotions.length;

        return {
            total: promotions.length,
            active,
            expired,
            avgDiscount,
        };
    }, [promotions]);

    const openCreate = () => {
        setEditingItem(null);
        setDrawerOpen(true);
    };

    const openEdit = (promotion) => {
        setEditingItem(promotion);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                productId: values.productId,
                discountPercent: values.discountPercent,
                startDate: toLocalDateTimePayload(values.startDate),
                endDate: toLocalDateTimePayload(values.endDate),
            };

            setConfirmLoading(true);
            if (editingItem) {
                await promotionApi.updatePromotionById(editingItem.id, payload);
                messageApi.success("Cập nhật khuyến mãi thành công.");
            } else {
                await promotionApi.createPromotion(payload);
                messageApi.success("Tạo khuyến mãi thành công.");
            }

            closeDrawer();
            fetchData();
        } catch (error) {
            if (error?.errorFields) return;
            messageApi.error(getErrorText(error, "Có lỗi xảy ra, vui lòng thử lại."));
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleDelete = async (promotion) => {
        try {
            await promotionApi.deletePromotionById(promotion.id);
            messageApi.success(`Đã xoá khuyến mãi của "${promotion.productName}".`);
            fetchData();
        } catch (error) {
            messageApi.error(getErrorText(error, "Xoá khuyến mãi thất bại."));
        }
    };

    const columns = [
        {
            title: "Sản phẩm",
            key: "product",
            render: (_, record) => {
                const product = productById.get(record.productId);
                return (
                    <div className="apr-product-cell">
                        <Text className="apr-product-name">
                            {record.productName || product?.name || `Sản phẩm #${record.productId}`}
                        </Text>
                        <Text className="apr-product-meta">
                            #{record.productId}
                            {product?.price != null ? ` - ${formatCurrency(product.price)}` : ""}
                        </Text>
                    </div>
                );
            },
        },
        {
            title: "Giảm giá",
            dataIndex: "discountPercent",
            key: "discountPercent",
            width: 120,
            align: "center",
            sorter: (a, b) => (Number(a.discountPercent) || 0) - (Number(b.discountPercent) || 0),
            render: (value) => <Tag color="volcano">-{value}%</Tag>,
        },
        {
            title: "Bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            width: 170,
            render: (value) => formatDateTime(value),
        },
        {
            title: "Kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            width: 170,
            render: (value) => formatDateTime(value),
        },
        {
            title: "Trạng thái",
            key: "state",
            width: 140,
            render: (_, record) => {
                const state = getPromotionState(record);
                return <Tag color={state.color}>{state.label}</Tag>;
            },
        },
        {
            title: "Hành động",
            key: "actions",
            width: 120,
            align: "right",
            render: (_, record) => (
                <Space size={8}>
                    <Button
                        className="apr-btn-edit"
                        icon={<PencilSimpleIcon size={15} weight="bold" />}
                        size="small"
                        onClick={() => openEdit(record)}
                    />
                    <Popconfirm
                        title="Xoá khuyến mãi?"
                        description={`Bạn có chắc muốn xoá khuyến mãi của "${record.productName}" không?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            icon={<TrashIcon size={15} weight="bold" />}
                            size="small"
                            danger
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="apr-page">
            {contextHolder}

            <div className="apr-header">
                <div>
                    <Title level={3} className="apr-title">Quản lý khuyến mãi</Title>
                    <Text className="apr-subtitle">
                        Tạo và kiểm soát ưu đãi theo từng sản phẩm
                    </Text>
                </div>
                <div className="apr-header-actions">
                    <Button icon={<ReloadOutlined />} onClick={fetchData} disabled={loading}>
                        Tải lại
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="apr-btn-add"
                        onClick={openCreate}
                    >
                        Thêm khuyến mãi
                    </Button>
                </div>
            </div>

            <div className="apr-metrics">
                <div className="apr-metric">
                    <span>Tổng ưu đãi</span>
                    <strong>{formatNumber(metrics.total)}</strong>
                </div>
                <div className="apr-metric">
                    <span>Đang áp dụng</span>
                    <strong>{formatNumber(metrics.active)}</strong>
                </div>
                <div className="apr-metric">
                    <span>Hết hạn</span>
                    <strong>{formatNumber(metrics.expired)}</strong>
                </div>
                <div className="apr-metric">
                    <span>Giảm trung bình</span>
                    <strong>{metrics.avgDiscount.toFixed(1)}%</strong>
                </div>
            </div>

            <div className="apr-toolbar">
                <Input
                    className="apr-search"
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo sản phẩm hoặc mã khuyến mãi"
                    allowClear
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
            </div>

            <Table
                className="apr-table"
                columns={columns}
                dataSource={filteredPromotions}
                rowKey="id"
                loading={loading}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không có khuyến mãi phù hợp"
                        />
                    ),
                }}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: [30, 50, 100],
                    showTotal: (total) => `${formatNumber(total)} khuyến mãi`,
                }}
                scroll={{ x: 900 }}
            />

            <Drawer
                title={
                    <span className="apr-drawer-title">
                        {isEditing ? "Cập nhật khuyến mãi" : "Thêm khuyến mãi"}
                    </span>
                }
                open={drawerOpen}
                onClose={closeDrawer}
                width={520}
                destroyOnClose
                className="apr-drawer"
                footer={
                    <div className="apr-footer">
                        <Space>
                            <Button onClick={closeDrawer}>Huỷ</Button>
                            <Button
                                type="primary"
                                className="apr-btn-add"
                                loading={confirmLoading}
                                onClick={handleSubmit}
                            >
                                {isEditing ? "Lưu thay đổi" : "Thêm"}
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Form form={form} layout="vertical" className="apr-form">
                    <Form.Item
                        name="productId"
                        label="Sản phẩm"
                        rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            placeholder="Chọn sản phẩm"
                            options={productOptions}
                            disabled={isEditing}
                        />
                    </Form.Item>

                    <Form.Item
                        name="discountPercent"
                        label="% giảm giá"
                        rules={[{ required: true, message: "Vui lòng nhập % giảm giá" }]}
                    >
                        <InputNumber
                            min={1}
                            max={100}
                            addonAfter="%"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item name="startDate" label="Ngày bắt đầu">
                        <Input type="datetime-local" />
                    </Form.Item>

                    <Form.Item name="endDate" label="Ngày kết thúc">
                        <Input type="datetime-local" />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
