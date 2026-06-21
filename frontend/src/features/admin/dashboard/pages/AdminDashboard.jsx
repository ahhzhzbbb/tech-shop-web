import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Package,
    SquaresFour,
    ShoppingCart,
    ChartBar,
    Tag,
} from "@phosphor-icons/react";
import { Empty, Spin, Table, Tag as StatusTag, Typography, message } from "antd";
import AdminCard from "../components/AdminCard";
import categoryApi from "../../category/categoryApi";
import ordersApi from "../../orders/ordersApi";
import promotionApi from "../../products/promotionApi";
import { fetchAllProducts } from "../../utils/adminData";
import {
    formatCurrency,
    formatDate,
    formatNumber,
    getOrderStatusMeta,
} from "../../utils/adminFormat";
import "./AdminDashboard.scss";

const { Title, Text } = Typography;

const MENU_ITEMS = [
    {
        key: "products",
        label: "Sản phẩm",
        description: "Quản lý tồn kho, trạng thái bán và thông số",
        icon: Package,
        path: "/admin/products",
    },
    {
        key: "categories",
        label: "Danh mục",
        description: "Phân loại sản phẩm và thuộc tính kỹ thuật",
        icon: SquaresFour,
        path: "/admin/categories",
    },
    {
        key: "orders",
        label: "Đơn hàng",
        description: "Theo dõi và xử lý đơn hàng của khách",
        icon: ShoppingCart,
        path: "/admin/orders",
    },
    {
        key: "promotions",
        label: "Khuyến mãi",
        description: "Tạo ưu đãi theo từng sản phẩm",
        icon: Tag,
        path: "/admin/promotions",
    },
    {
        key: "statistics",
        label: "Thống kê",
        description: "Báo cáo doanh thu, sản phẩm và tồn kho",
        icon: ChartBar,
        path: "/admin/statistics",
    },
];

const getErrorText = (error, fallback) =>
    error?.response?.data?.message || error?.response?.data || fallback;

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [promotions, setPromotions] = useState([]);
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
            messageApi.error(getErrorText(error, "Không thể tải dữ liệu tổng quan."));
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const metrics = useMemo(() => {
        const revenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
        const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
        const lowStock = products.filter((product) => {
            const quantity = Number(product.quantity) || 0;
            return quantity > 0 && quantity <= 5;
        }).length;
        const activeCategories = categories.filter((category) => category.active !== false).length;

        return [
            { label: "Doanh thu", value: formatCurrency(revenue), tone: "red" },
            { label: "Sản phẩm", value: formatNumber(products.length), tone: "blue" },
            { label: "Đơn chờ xử lý", value: formatNumber(pendingOrders), tone: "gold" },
            { label: "Sắp hết hàng", value: formatNumber(lowStock), tone: "orange" },
            { label: "Danh mục hoạt động", value: formatNumber(activeCategories), tone: "green" },
            { label: "Khuyến mãi", value: formatNumber(promotions.length), tone: "purple" },
        ];
    }, [categories, orders, products, promotions.length]);

    const recentOrders = useMemo(() => {
        return [...orders]
            .sort((a, b) => {
                const timeA = new Date(a.orderDate || 0).getTime();
                const timeB = new Date(b.orderDate || 0).getTime();
                if (timeA !== timeB) return timeB - timeA;
                return b.id - a.id;
            })
            .slice(0, 5);
    }, [orders]);

    const lowStockProducts = useMemo(() => {
        return products
            .filter((product) => Number(product.quantity) <= 5)
            .sort((a, b) => (Number(a.quantity) || 0) - (Number(b.quantity) || 0))
            .slice(0, 5);
    }, [products]);

    const orderColumns = [
        {
            title: "Đơn",
            dataIndex: "id",
            key: "id",
            width: 90,
            render: (value) => <Text strong>#{value}</Text>,
        },
        {
            title: "Ngày",
            dataIndex: "orderDate",
            key: "orderDate",
            render: (value) => formatDate(value),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right",
            render: (value) => formatCurrency(value),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value) => {
                const meta = getOrderStatusMeta(value);
                return <StatusTag color={meta.color}>{meta.label}</StatusTag>;
            },
        },
    ];

    const stockColumns = [
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },
        {
            title: "Danh mục",
            dataIndex: "categoryName",
            key: "categoryName",
            width: 130,
            render: (value) => value || "-",
        },
        {
            title: "Tồn",
            dataIndex: "quantity",
            key: "quantity",
            width: 80,
            align: "center",
            render: (value) => {
                const quantity = Number(value) || 0;
                return <StatusTag color={quantity <= 0 ? "red" : "gold"}>{quantity}</StatusTag>;
            },
        },
    ];

    return (
        <div className="admin-dashboard">
            {contextHolder}
            <div className="admin-dashboard__header">
                <div>
                    <Title level={3} className="admin-dashboard__title">
                        Bảng điều khiển
                    </Title>
                    <Text className="admin-dashboard__subtitle">
                        Tổng quan vận hành cửa hàng và lối tắt quản trị
                    </Text>
                </div>
            </div>

            <Spin spinning={loading}>
                <div className="admin-dashboard__metrics">
                    {metrics.map((item) => (
                        <div className={`admin-dashboard__metric admin-dashboard__metric--${item.tone}`} key={item.label}>
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
                </div>

                <div className="admin-dashboard__grid">
                    {MENU_ITEMS.map((item) => (
                        <AdminCard key={item.key} item={item} />
                    ))}
                </div>

                <div className="admin-dashboard__tables">
                    <section className="admin-dashboard__panel">
                        <div className="admin-dashboard__panel-header">
                            <Text strong>Đơn hàng gần đây</Text>
                        </div>
                        <Table
                            columns={orderColumns}
                            dataSource={recentOrders}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có đơn hàng" /> }}
                        />
                    </section>

                    <section className="admin-dashboard__panel">
                        <div className="admin-dashboard__panel-header">
                            <Text strong>Cảnh báo tồn kho</Text>
                        </div>
                        <Table
                            columns={stockColumns}
                            dataSource={lowStockProducts}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Tồn kho ổn định" /> }}
                        />
                    </section>
                </div>
            </Spin>
        </div>
    );
}

export default AdminDashboard;
