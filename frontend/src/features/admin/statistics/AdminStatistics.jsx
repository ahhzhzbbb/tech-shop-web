import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Empty,
    Select,
    Spin,
    Table,
    Tag,
    Typography,
    message,
} from "antd";
import categoryApi from "../category/categoryApi";
import ordersApi from "../orders/ordersApi";
import promotionApi from "../products/promotionApi";
import { fetchAllProducts } from "../utils/adminData";
import {
    formatCurrency,
    formatDate,
    formatNumber,
    getOrderStatusMeta,
    ORDER_STATUS_OPTIONS,
} from "../utils/adminFormat";
import "./AdminStatistics.scss";

const { Title, Text } = Typography;

const RANGE_OPTIONS = [
    { label: "Tất cả thời gian", value: "all" },
    { label: "7 ngày gần nhất", value: "7" },
    { label: "30 ngày gần nhất", value: "30" },
    { label: "90 ngày gần nhất", value: "90" },
];

const getErrorText = (error, fallback) =>
    error?.response?.data?.message || error?.response?.data || fallback;

function AdminStatistics() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [range, setRange] = useState("30");
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [productList, categoryData, orderData, promotionData] = await Promise.all([
                fetchAllProducts(),
                categoryApi.getCategories(true),
                ordersApi.getAllOrders(),
                promotionApi.getAllPromotions(),
            ]);
            setProducts(productList);
            setCategories(categoryData.categories || []);
            setOrders(orderData.orders || []);
            setPromotions(promotionData.promotionItems || []);
        } catch (error) {
            messageApi.error(getErrorText(error, "Không thể tải dữ liệu thống kê."));
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const ordersInRange = useMemo(() => {
        if (range === "all") return orders;

        const days = Number(range);
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - days + 1);

        return orders.filter((order) => {
            const time = new Date(order.orderDate || 0).getTime();
            return time >= start.getTime();
        });
    }, [orders, range]);

    const summary = useMemo(() => {
        const revenue = ordersInRange.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
        const completedRevenue = ordersInRange
            .filter((order) => order.status === "COMPLETED")
            .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
        const totalItems = ordersInRange.reduce((sum, order) => {
            return sum + (order.orderItems || []).reduce((itemSum, item) => itemSum + (Number(item.quantity) || 0), 0);
        }, 0);

        return {
            revenue,
            completedRevenue,
            orders: ordersInRange.length,
            avgOrder: ordersInRange.length ? revenue / ordersInRange.length : 0,
            totalItems,
            products: products.length,
            promotions: promotions.length,
        };
    }, [ordersInRange, products.length, promotions.length]);

    const revenueByStatus = useMemo(() => {
        return ORDER_STATUS_OPTIONS.map((status) => {
            const matchedOrders = ordersInRange.filter((order) => order.status === status.value);
            const revenue = matchedOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

            return {
                ...status,
                orders: matchedOrders.length,
                revenue,
            };
        }).filter((item) => item.orders > 0 || item.revenue > 0);
    }, [ordersInRange]);

    const revenueTimeline = useMemo(() => {
        const map = new Map();

        ordersInRange.forEach((order) => {
            const key = order.orderDate || "Không rõ";
            const current = map.get(key) || { date: key, orders: 0, revenue: 0 };
            current.orders += 1;
            current.revenue += Number(order.totalAmount) || 0;
            map.set(key, current);
        });

        return Array.from(map.values())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-10);
    }, [ordersInRange]);

    const topProducts = useMemo(() => {
        const map = new Map();

        ordersInRange.forEach((order) => {
            (order.orderItems || []).forEach((item) => {
                const current = map.get(item.productId) || {
                    productId: item.productId,
                    productName: item.productName,
                    quantity: 0,
                    revenue: 0,
                };
                current.quantity += Number(item.quantity) || 0;
                current.revenue += (Number(item.quantity) || 0) * (Number(item.price) || 0);
                map.set(item.productId, current);
            });
        });

        return Array.from(map.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 8);
    }, [ordersInRange]);

    const categoryInventory = useMemo(() => {
        return categories.map((category) => {
            const categoryProducts = products.filter((product) => product.categoryId === category.id);
            const stock = categoryProducts.reduce((sum, product) => sum + (Number(product.quantity) || 0), 0);
            const lowStock = categoryProducts.filter((product) => {
                const quantity = Number(product.quantity) || 0;
                return quantity > 0 && quantity <= 5;
            }).length;

            return {
                id: category.id,
                name: category.name,
                active: category.active,
                products: categoryProducts.length,
                stock,
                lowStock,
            };
        });
    }, [categories, products]);

    const maxTimelineRevenue = Math.max(...revenueTimeline.map((item) => item.revenue), 1);
    const maxStatusRevenue = Math.max(...revenueByStatus.map((item) => item.revenue), 1);

    const topProductColumns = [
        {
            title: "Sản phẩm",
            dataIndex: "productName",
            key: "productName",
            render: (value, record) => value || `Sản phẩm #${record.productId}`,
        },
        {
            title: "Đã bán",
            dataIndex: "quantity",
            key: "quantity",
            width: 110,
            align: "center",
            render: (value) => formatNumber(value),
        },
        {
            title: "Doanh thu",
            dataIndex: "revenue",
            key: "revenue",
            width: 160,
            align: "right",
            render: (value) => formatCurrency(value),
        },
    ];

    const inventoryColumns = [
        {
            title: "Danh mục",
            dataIndex: "name",
            key: "name",
            render: (value, record) => (
                <span>
                    {value}{" "}
                    {record.active === false && <Tag color="default">Ẩn</Tag>}
                </span>
            ),
        },
        {
            title: "Sản phẩm",
            dataIndex: "products",
            key: "products",
            width: 110,
            align: "center",
            render: (value) => formatNumber(value),
        },
        {
            title: "Tồn kho",
            dataIndex: "stock",
            key: "stock",
            width: 110,
            align: "center",
            render: (value) => formatNumber(value),
        },
        {
            title: "Sắp hết",
            dataIndex: "lowStock",
            key: "lowStock",
            width: 110,
            align: "center",
            render: (value) => <Tag color={value > 0 ? "gold" : "green"}>{formatNumber(value)}</Tag>,
        },
    ];

    return (
        <div className="ast-page">
            {contextHolder}
            <div className="ast-header">
                <div>
                    <Title level={3} className="ast-title">Thống kê</Title>
                    <Text className="ast-subtitle">
                        Báo cáo doanh thu, đơn hàng, tồn kho và hiệu suất sản phẩm
                    </Text>
                </div>
                <Select
                    className="ast-range"
                    value={range}
                    onChange={setRange}
                    options={RANGE_OPTIONS}
                />
            </div>

            <Spin spinning={loading}>
                <div className="ast-summary">
                    <div className="ast-summary-card">
                        <span>Doanh thu</span>
                        <strong>{formatCurrency(summary.revenue)}</strong>
                    </div>
                    <div className="ast-summary-card">
                        <span>Doanh thu hoàn tất</span>
                        <strong>{formatCurrency(summary.completedRevenue)}</strong>
                    </div>
                    <div className="ast-summary-card">
                        <span>Số đơn</span>
                        <strong>{formatNumber(summary.orders)}</strong>
                    </div>
                    <div className="ast-summary-card">
                        <span>Giá trị đơn TB</span>
                        <strong>{formatCurrency(summary.avgOrder)}</strong>
                    </div>
                    <div className="ast-summary-card">
                        <span>Sản phẩm bán ra</span>
                        <strong>{formatNumber(summary.totalItems)}</strong>
                    </div>
                    <div className="ast-summary-card">
                        <span>Khuyến mãi</span>
                        <strong>{formatNumber(summary.promotions)}</strong>
                    </div>
                </div>

                <div className="ast-panels">
                    <section className="ast-panel">
                        <div className="ast-panel__header">
                            <Text strong>Doanh thu theo ngày</Text>
                        </div>
                        {revenueTimeline.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu doanh thu" />
                        ) : (
                            <div className="ast-bars">
                                {revenueTimeline.map((item) => (
                                    <div className="ast-bar-row" key={item.date}>
                                        <span className="ast-bar-row__label">{formatDate(item.date)}</span>
                                        <div className="ast-bar-row__track">
                                            <div
                                                className="ast-bar-row__fill"
                                                style={{ width: `${Math.max((item.revenue / maxTimelineRevenue) * 100, 4)}%` }}
                                            />
                                        </div>
                                        <span className="ast-bar-row__value">{formatCurrency(item.revenue)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="ast-panel">
                        <div className="ast-panel__header">
                            <Text strong>Doanh thu theo trạng thái</Text>
                        </div>
                        {revenueByStatus.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có đơn hàng" />
                        ) : (
                            <div className="ast-bars">
                                {revenueByStatus.map((item) => {
                                    const meta = getOrderStatusMeta(item.value);
                                    return (
                                        <div className="ast-bar-row" key={item.value}>
                                            <span className="ast-bar-row__label">
                                                <Tag color={meta.color}>{item.label}</Tag>
                                            </span>
                                            <div className="ast-bar-row__track">
                                                <div
                                                    className="ast-bar-row__fill ast-bar-row__fill--status"
                                                    style={{ width: `${Math.max((item.revenue / maxStatusRevenue) * 100, 4)}%` }}
                                                />
                                            </div>
                                            <span className="ast-bar-row__value">
                                                {formatCurrency(item.revenue)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                <div className="ast-tables">
                    <section className="ast-panel">
                        <div className="ast-panel__header">
                            <Text strong>Sản phẩm bán chạy</Text>
                        </div>
                        <Table
                            columns={topProductColumns}
                            dataSource={topProducts}
                            rowKey="productId"
                            pagination={false}
                            size="small"
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu bán hàng" /> }}
                        />
                    </section>

                    <section className="ast-panel">
                        <div className="ast-panel__header">
                            <Text strong>Tồn kho theo danh mục</Text>
                        </div>
                        <Table
                            columns={inventoryColumns}
                            dataSource={categoryInventory}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có danh mục" /> }}
                        />
                    </section>
                </div>
            </Spin>
        </div>
    );
}

export default AdminStatistics;
