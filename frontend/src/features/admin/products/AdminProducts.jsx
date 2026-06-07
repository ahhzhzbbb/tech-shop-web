import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    Empty,
    Image,
    Input,
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
import productsApi from "./productsApi";
import promotionApi from "./promotionApi";
import categoryApi from "../category/categoryApi";
import ProductDrawer from "../components/ProductDrawer";
import {
    formatCurrency,
    formatNumber,
    getProductStatusMeta,
    PRODUCT_STATUS_OPTIONS,
} from "../utils/adminFormat";
import { fetchAllProducts } from "../utils/adminData";
import "./AdminProducts.scss";

const { Title, Text } = Typography;

const STOCK_OPTIONS = [
    { label: "Tất cả tồn kho", value: "all" },
    { label: "Còn hàng", value: "available" },
    { label: "Sắp hết", value: "low" },
    { label: "Hết hàng", value: "out" },
];

const getErrorText = (error, fallback) =>
    error?.response?.data?.message || error?.response?.data || fallback;

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("all");
    const [status, setStatus] = useState("all");
    const [stockStatus, setStockStatus] = useState("all");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const promotionByProductId = useMemo(() => {
        const map = new Map();
        promotions.forEach((promotion) => {
            map.set(promotion.productId, promotion);
        });
        return map;
    }, [promotions]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [productList, categoryData, promotionData] = await Promise.all([
                fetchAllProducts(),
                categoryApi.getCategories(true),
                promotionApi.getAllPromotions(),
            ]);

            setProducts(productList);
            setCategories(categoryData.categories || []);
            setPromotions(promotionData.promotionItems || []);
        } catch (error) {
            messageApi.error(getErrorText(error, "Không thể tải danh sách sản phẩm."));
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredProducts = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return products.filter((product) => {
            const productName = product.name?.toLowerCase() || "";
            const categoryName = product.categoryName?.toLowerCase() || "";
            const quantity = Number(product.quantity) || 0;

            if (
                normalizedKeyword &&
                !productName.includes(normalizedKeyword) &&
                !categoryName.includes(normalizedKeyword)
            ) {
                return false;
            }

            if (categoryId !== "all" && product.categoryId !== categoryId) {
                return false;
            }

            if (status !== "all" && product.status !== status) {
                return false;
            }

            if (stockStatus === "out" && quantity > 0) return false;
            if (stockStatus === "low" && (quantity <= 0 || quantity > 5)) return false;
            if (stockStatus === "available" && quantity <= 5) return false;

            return true;
        });
    }, [categoryId, keyword, products, status, stockStatus]);

    const metrics = useMemo(() => {
        const activeProducts = products.filter((item) => item.status === "ACTIVE").length;
        const lowStockProducts = products.filter((item) => {
            const quantity = Number(item.quantity) || 0;
            return quantity > 0 && quantity <= 5;
        }).length;
        const outOfStockProducts = products.filter((item) => Number(item.quantity) <= 0).length;

        return {
            total: products.length,
            active: activeProducts,
            lowStock: lowStockProducts,
            outOfStock: outOfStockProducts,
            promotions: promotions.length,
        };
    }, [products, promotions.length]);

    const openCreate = () => {
        setEditingItem(null);
        setDrawerOpen(true);
    };

    const openEdit = (product) => {
        setEditingItem(product);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingItem(null);
    };

    const applyPromotion = async (productId, promotion) => {
        if (!promotion || productId == null) return;

        const {
            enabled,
            discountPercent,
            existingPromoId,
            existingDiscountPercent,
        } = promotion;

        if (existingPromoId) {
            if (!enabled) {
                await promotionApi.deletePromotionById(existingPromoId);
            } else if (discountPercent !== existingDiscountPercent) {
                await promotionApi.updatePromotionById(existingPromoId, {
                    productId,
                    discountPercent,
                });
            }
        } else if (enabled) {
            await promotionApi.createPromotion({ productId, discountPercent });
        }
    };

    const handleSubmit = async (values, promotion) => {
        setConfirmLoading(true);
        try {
            let productId;

            if (editingItem) {
                await productsApi.updateProduct(editingItem.id, values);
                productId = editingItem.id;
                messageApi.success("Cập nhật sản phẩm thành công.");
            } else {
                const created = await productsApi.createProduct(values);
                productId = created?.id;
                messageApi.success("Thêm sản phẩm thành công.");
            }

            await applyPromotion(productId, promotion);
            closeDrawer();
            fetchData();
        } catch (error) {
            messageApi.error(getErrorText(error, "Có lỗi xảy ra, vui lòng thử lại."));
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleDelete = async (product) => {
        try {
            await productsApi.deleteProduct(product.id);
            messageApi.success(`Đã xoá sản phẩm "${product.name}".`);
            fetchData();
        } catch (error) {
            messageApi.error(getErrorText(error, "Xoá thất bại, vui lòng thử lại."));
        }
    };

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
            width: 360,
            render: (_, record) => (
                <div className="ap-product-cell">
                    {record.thumbnail ? (
                        <Image
                            src={record.thumbnail}
                            alt={record.name}
                            width={58}
                            height={58}
                            className="ap-product-image"
                            preview={false}
                        />
                    ) : (
                        <div className="ap-product-image ap-product-image--empty">
                            <span>No image</span>
                        </div>
                    )}
                    <div className="ap-product-main">
                        <Text className="ap-product-name" title={record.name}>
                            {record.name}
                        </Text>
                        <Text className="ap-product-desc" title={record.description}>
                            {record.description || "Chưa có mô tả"}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Danh mục",
            dataIndex: "categoryName",
            key: "categoryName",
            width: 150,
            render: (value) => <Tag color="blue">{value || "Chưa phân loại"}</Tag>,
        },
        {
            title: "Giá bán",
            dataIndex: "price",
            key: "price",
            width: 140,
            align: "right",
            sorter: (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
            render: (value) => <Text className="ap-price">{formatCurrency(value)}</Text>,
        },
        {
            title: "Tồn kho",
            dataIndex: "quantity",
            key: "quantity",
            width: 110,
            align: "center",
            sorter: (a, b) => (Number(a.quantity) || 0) - (Number(b.quantity) || 0),
            render: (value) => {
                const quantity = Number(value) || 0;
                const color = quantity <= 0 ? "red" : quantity <= 5 ? "gold" : "green";
                return <Tag color={color}>{formatNumber(quantity)}</Tag>;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (value) => {
                const meta = getProductStatusMeta(value);
                return <Tag color={meta.color}>{meta.label}</Tag>;
            },
        },
        {
            title: "Khuyến mãi",
            key: "promotion",
            width: 120,
            render: (_, record) => {
                const promotion = promotionByProductId.get(record.id);
                return promotion ? (
                    <Tag color="volcano">-{promotion.discountPercent}%</Tag>
                ) : (
                    <Text className="ap-muted">Không</Text>
                );
            },
        },
        {
            title: "Đánh giá",
            dataIndex: "averageScore",
            key: "averageScore",
            width: 110,
            align: "center",
            render: (value) => (value ? Number(value).toFixed(1) : "-"),
        },
        {
            title: "Hành động",
            key: "actions",
            width: 130,
            fixed: "right",
            align: "right",
            render: (_, record) => (
                <Space size={8}>
                    <Button
                        className="ap-btn-edit"
                        icon={<PencilSimpleIcon size={15} weight="bold" />}
                        size="small"
                        onClick={() => openEdit(record)}
                    />
                    <Popconfirm
                        title="Xoá sản phẩm?"
                        description={`Bạn có chắc muốn xoá "${record.name}" không?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            className="ap-btn-delete"
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
        <div className="ap-page">
            {contextHolder}

            <div className="ap-header">
                <div>
                    <Title level={3} className="ap-title">Quản lý sản phẩm</Title>
                    <Text className="ap-subtitle">
                        Quản lý danh mục, tồn kho, trạng thái bán và khuyến mãi của sản phẩm
                    </Text>
                </div>

                <div className="ap-header-actions">
                    <Button icon={<ReloadOutlined />} onClick={fetchData} disabled={loading}>
                        Tải lại
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="ap-btn-add"
                        onClick={openCreate}
                    >
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>

            <div className="ap-metrics">
                <div className="ap-metric">
                    <span className="ap-metric__label">Tổng sản phẩm</span>
                    <strong>{formatNumber(metrics.total)}</strong>
                </div>
                <div className="ap-metric">
                    <span className="ap-metric__label">Đang bán</span>
                    <strong>{formatNumber(metrics.active)}</strong>
                </div>
                <div className="ap-metric">
                    <span className="ap-metric__label">Sắp hết hàng</span>
                    <strong>{formatNumber(metrics.lowStock)}</strong>
                </div>
                <div className="ap-metric">
                    <span className="ap-metric__label">Hết hàng</span>
                    <strong>{formatNumber(metrics.outOfStock)}</strong>
                </div>
                <div className="ap-metric">
                    <span className="ap-metric__label">Đang khuyến mãi</span>
                    <strong>{formatNumber(metrics.promotions)}</strong>
                </div>
            </div>

            <div className="ap-toolbar">
                <Input
                    className="ap-search"
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo tên sản phẩm hoặc danh mục"
                    allowClear
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <Select
                    className="ap-filter"
                    value={categoryId}
                    onChange={setCategoryId}
                    options={[
                        { label: "Tất cả danh mục", value: "all" },
                        ...categories.map((category) => ({
                            label: category.active === false ? `${category.name} (ẩn)` : category.name,
                            value: category.id,
                        })),
                    ]}
                />
                <Select
                    className="ap-filter"
                    value={status}
                    onChange={setStatus}
                    options={[
                        { label: "Tất cả trạng thái", value: "all" },
                        ...PRODUCT_STATUS_OPTIONS.map((item) => ({
                            label: item.label,
                            value: item.value,
                        })),
                    ]}
                />
                <Select
                    className="ap-filter"
                    value={stockStatus}
                    onChange={setStockStatus}
                    options={STOCK_OPTIONS}
                />
            </div>

            <Table
                className="ap-table"
                columns={columns}
                dataSource={filteredProducts}
                rowKey="id"
                loading={loading}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không có sản phẩm phù hợp"
                        />
                    ),
                }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50],
                    showTotal: (total) => `${formatNumber(total)} sản phẩm`,
                }}
                scroll={{ x: 1120 }}
            />

            <ProductDrawer
                open={drawerOpen}
                onClose={closeDrawer}
                onSubmit={handleSubmit}
                editingItem={editingItem}
                confirmLoading={confirmLoading}
            />
        </div>
    );
}
