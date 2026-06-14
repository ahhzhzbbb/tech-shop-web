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
import "./AdminProducts.scss";

const PAGE_SIZE_OPTIONS = [30, 50, 100];

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
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [brand, setBrand] = useState("");
    const [debouncedBrand, setDebouncedBrand] = useState("");
    const [categoryId, setCategoryId] = useState("all");
    const [status, setStatus] = useState("all");
    const [stockStatus, setStockStatus] = useState("all");
    // Phân trang phía server (page 0-based theo backend)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(30);
    const [total, setTotal] = useState(0);
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

    const fetchMeta = useCallback(async () => {
        try {
            const [categoryData, promotionData] = await Promise.all([
                categoryApi.getCategories(true), // Bao gồm cả danh mục ẩn
                promotionApi.getAllPromotions(),
            ]);
            setCategories(categoryData.categories || []);
            setPromotions(promotionData.promotionItems || []);
        } catch (error) {
            messageApi.error(getErrorText(error, "Không thể tải danh mục/khuyến mãi."));
        }
    }, [messageApi]);

    // Tải danh sách sản phẩm theo trang (server-side)
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            let data;
            if (debouncedKeyword) {
                // /filter không hỗ trợ keyword -> dùng /search (bỏ qua lọc danh mục)
                data = await productsApi.searchProducts(debouncedKeyword, page, pageSize);
            } else {
                data = await productsApi.filterProducts({
                    categoryId: categoryId !== "all" ? categoryId : undefined,
                    brandName: debouncedBrand || undefined,
                    page,
                    size: pageSize,
                });
            }
            setProducts(data.products || []);
            setTotal(data.pagination?.totalElements || 0);
        } catch (error) {
            messageApi.error(getErrorText(error, "Không thể tải danh sách sản phẩm."));
        } finally {
            setLoading(false);
        }
    }, [debouncedKeyword, categoryId, debouncedBrand, page, pageSize, messageApi]);

    useEffect(() => {
        fetchMeta();
    }, [fetchMeta]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Debounce ô tìm kiếm + về trang đầu khi đổi từ khoá
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword.trim());
            setPage(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [keyword]);

    // Debounce ô lọc theo hãng
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedBrand(brand.trim());
            setPage(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [brand]);

    // status / stock backend chưa hỗ trợ -> lọc thêm trên trang hiện tại
    const visibleProducts = useMemo(() => {
        return products.filter((product) => {
            const quantity = Number(product.quantity) || 0;
            if (status !== "all" && product.status !== status) return false;
            if (stockStatus === "out" && quantity > 0) return false;
            if (stockStatus === "low" && (quantity <= 0 || quantity > 5)) return false;
            if (stockStatus === "available" && quantity <= 5) return false;
            return true;
        });
    }, [products, status, stockStatus]);

    const metrics = useMemo(() => {
        // Tổng = totalElements từ server; các chỉ số trạng thái tính trên trang hiện tại
        const activeProducts = products.filter((item) => item.status === "ACTIVE").length;
        const lowStockProducts = products.filter((item) => {
            const quantity = Number(item.quantity) || 0;
            return quantity > 0 && quantity <= 5;
        }).length;
        const outOfStockProducts = products.filter((item) => Number(item.quantity) <= 0).length;

        return {
            total,
            active: activeProducts,
            lowStock: lowStockProducts,
            outOfStock: outOfStockProducts,
            promotions: promotions.length,
        };
    }, [products, promotions.length, total]);

    const handleCategoryChange = (value) => {
        setCategoryId(value);
        setPage(0);
    };

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
            fetchProducts();
            fetchMeta();
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
            fetchProducts();
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
            title: "Hãng",
            dataIndex: "brandName",
            key: "brandName",
            width: 120,
            render: (value) => value || <Text type="secondary">—</Text>,
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
                    <Button icon={<ReloadOutlined />} onClick={fetchProducts} disabled={loading}>
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
                    onChange={handleCategoryChange}
                    disabled={!!debouncedKeyword}
                    options={[
                        { label: "Tất cả danh mục", value: "all" },
                        ...categories.map((category) => ({
                            label: category.active === false ? `${category.name} (ẩn)` : category.name,
                            value: category.id,
                        })),
                    ]}
                />
                <Input
                    className="ap-filter"
                    placeholder="Lọc theo hãng"
                    allowClear
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    disabled={!!debouncedKeyword}
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
                dataSource={visibleProducts}
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
                    current: page + 1,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    pageSizeOptions: PAGE_SIZE_OPTIONS,
                    showTotal: (value) => `${formatNumber(value)} sản phẩm`,
                }}
                onChange={(pag) => {
                    setPage((pag.current || 1) - 1);
                    setPageSize(pag.pageSize || 10);
                }}
                scroll={{ x: 1240 }}
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
