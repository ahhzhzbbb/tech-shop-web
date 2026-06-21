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
import {
    EyeIcon,
    PencilSimpleIcon,
    TrashIcon,
} from "@phosphor-icons/react";
import ordersApi from "./ordersApi";
import { fetchAllProducts } from "../utils/adminData";
import {
    formatCurrency,
    formatDate,
    formatNumber,
    getOrderStatusMeta,
    ORDER_STATUS_OPTIONS,
    toDateInputValue,
} from "../utils/adminFormat";
import "./AdminOrders.scss";

const { Title, Text } = Typography;
const { TextArea } = Input;

const getErrorText = (error, fallback) =>
    error?.response?.data?.message || error?.response?.data || fallback;

export default function AdminOrders() {
    const [form] = Form.useForm();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState("view");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [messageApi, contextHolder] = message.useMessage();

    const watchedItems = Form.useWatch("orderItems", form);
    const isCreating = drawerMode === "create";
    const isReadonly = drawerMode === "view";

    const computedTotal = useMemo(() => {
        return (watchedItems || []).reduce((total, item) => {
            const quantity = Number(item?.quantity) || 0;
            const price = Number(item?.price) || 0;
            return total + quantity * price;
        }, 0);
    }, [watchedItems]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [orderData, productList] = await Promise.all([
                ordersApi.getAllOrders(),
                fetchAllProducts(),
            ]);
            setOrders(orderData.orders || []);
            setProducts(productList);
        } catch (error) {
            messageApi.error(getErrorText(error, "Không thể tải danh sách đơn hàng."));
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!drawerOpen) return;

        if (selectedOrder) {
            form.setFieldsValue({
                orderDate: toDateInputValue(selectedOrder.orderDate),
                totalAmount: selectedOrder.totalAmount,
                status: selectedOrder.status || "PENDING",
                notes: selectedOrder.notes,
                userId: selectedOrder.userId,
                orderItems: selectedOrder.orderItems || [],
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                orderDate: new Date().toISOString().slice(0, 10),
                status: "PENDING",
                orderItems: [{ quantity: 1 }],
            });
        }
    }, [drawerOpen, selectedOrder, form]);

    useEffect(() => {
        if (drawerOpen && isCreating) {
            form.setFieldValue("totalAmount", computedTotal);
        }
    }, [computedTotal, drawerOpen, form, isCreating]);

    const filteredOrders = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return orders.filter((order) => {
            if (statusFilter !== "all" && order.status !== statusFilter) {
                return false;
            }

            if (!normalizedKeyword) return true;

            const productNames = (order.orderItems || [])
                .map((item) => item.productName)
                .join(" ")
                .toLowerCase();

            return (
                `${order.id}`.includes(normalizedKeyword) ||
                `${order.userId}`.includes(normalizedKeyword) ||
                productNames.includes(normalizedKeyword)
            );
        });
    }, [keyword, orders, statusFilter]);

    const metrics = useMemo(() => {
        const totalRevenue = orders.reduce(
            (sum, order) => sum + (Number(order.totalAmount) || 0),
            0
        );
        const completed = orders.filter((order) => order.status === "COMPLETED").length;
        const pending = orders.filter((order) => order.status === "PENDING").length;
        const cancelled = orders.filter((order) => order.status === "CANCELLED").length;

        return {
            total: orders.length,
            revenue: totalRevenue,
            completed,
            pending,
            cancelled,
        };
    }, [orders]);

    const productOptions = useMemo(
        () =>
            products.map((product) => ({
                label: `${product.name} - ${formatCurrency(product.price)}`,
                value: product.id,
            })),
        [products]
    );

    const openCreate = () => {
        setSelectedOrder(null);
        setDrawerMode("create");
        setDrawerOpen(true);
    };

    const openView = (order) => {
        setSelectedOrder(order);
        setDrawerMode("view");
        setDrawerOpen(true);
    };

    const openEdit = (order) => {
        setSelectedOrder(order);
        setDrawerMode("edit");
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedOrder(null);
    };

    const handleProductChange = (index, productId) => {
        const product = products.find((item) => item.id === productId);
        if (!product) return;
        form.setFieldValue(["orderItems", index, "price"], product.price);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);

            if (isCreating) {
                const payload = {
                    orderDate: values.orderDate,
                    totalAmount: values.totalAmount ?? computedTotal,
                    status: values.status,
                    notes: values.notes,
                    userId: values.userId,
                    orderItems: (values.orderItems || []).map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                };
                await ordersApi.createOrder(payload);
                messageApi.success("Tạo đơn hàng thành công.");
            } else if (selectedOrder) {
                const payload = {
                    orderDate: values.orderDate,
                    totalAmount: values.totalAmount,
                    status: values.status,
                    notes: values.notes,
                };
                await ordersApi.updateOrder(selectedOrder.id, payload);
                messageApi.success("Cập nhật đơn hàng thành công.");
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

    const handleDelete = async (order) => {
        try {
            await ordersApi.deleteOrder(order.id);
            messageApi.success(`Đã xoá đơn hàng #${order.id}.`);
            fetchData();
        } catch (error) {
            messageApi.error(getErrorText(error, "Xoá đơn hàng thất bại."));
        }
    };

    const itemColumns = [
        {
            title: "Sản phẩm",
            dataIndex: "productName",
            key: "productName",
            render: (value, record) => value || `#${record.productId}`,
        },
        {
            title: "SL",
            dataIndex: "quantity",
            key: "quantity",
            width: 90,
            align: "center",
        },
        {
            title: "Đơn giá",
            dataIndex: "price",
            key: "price",
            width: 150,
            align: "right",
            render: (value) => formatCurrency(value),
        },
        {
            title: "Thành tiền",
            key: "subtotal",
            width: 150,
            align: "right",
            render: (_, record) => formatCurrency((record.quantity || 0) * (record.price || 0)),
        },
    ];

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            key: "id",
            width: 100,
            sorter: (a, b) => a.id - b.id,
            render: (value) => <Text className="ao-order-id">#{value}</Text>,
        },
        {
            title: "Ngày đặt",
            dataIndex: "orderDate",
            key: "orderDate",
            width: 130,
            sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
            render: (value) => formatDate(value),
        },
        {
            title: "Khách hàng",
            dataIndex: "userId",
            key: "userId",
            width: 120,
            render: (value) => <Tag color="blue">User #{value}</Tag>,
        },
        {
            title: "Sản phẩm",
            key: "items",
            width: 110,
            align: "center",
            render: (_, record) => formatNumber(record.orderItems?.length || 0),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 150,
            align: "right",
            sorter: (a, b) => (Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0),
            render: (value) => <Text className="ao-price">{formatCurrency(value)}</Text>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (value) => {
                const meta = getOrderStatusMeta(value);
                return <Tag color={meta.color}>{meta.label}</Tag>;
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "notes",
            key: "notes",
            ellipsis: true,
            render: (value) => value || <Text className="ao-muted">Không có</Text>,
        },
        {
            title: "Hành động",
            key: "actions",
            width: 150,
            fixed: "right",
            align: "right",
            render: (_, record) => (
                <Space size={8}>
                    <Button
                        icon={<EyeIcon size={15} weight="bold" />}
                        size="small"
                        onClick={() => openView(record)}
                    />
                    <Button
                        className="ao-btn-edit"
                        icon={<PencilSimpleIcon size={15} weight="bold" />}
                        size="small"
                        onClick={() => openEdit(record)}
                    />
                    <Popconfirm
                        title="Xoá đơn hàng?"
                        description={`Bạn có chắc muốn xoá đơn hàng #${record.id} không?`}
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

    const drawerTitle = {
        create: "Tạo đơn hàng thủ công",
        edit: selectedOrder ? `Cập nhật đơn hàng #${selectedOrder.id}` : "Cập nhật đơn hàng",
        view: selectedOrder ? `Chi tiết đơn hàng #${selectedOrder.id}` : "Chi tiết đơn hàng",
    }[drawerMode];

    return (
        <div className="ao-page">
            {contextHolder}

            <div className="ao-header">
                <div>
                    <Title level={3} className="ao-title">Quản lý đơn hàng</Title>
                    <Text className="ao-subtitle">
                        Theo dõi, tạo thủ công, cập nhật trạng thái và xử lý đơn hàng
                    </Text>
                </div>
                <div className="ao-header-actions">
                    <Button icon={<ReloadOutlined />} onClick={fetchData} disabled={loading}>
                        Tải lại
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="ao-btn-add"
                        onClick={openCreate}
                    >
                        Tạo đơn
                    </Button>
                </div>
            </div>

            <div className="ao-metrics">
                <div className="ao-metric">
                    <span>Tổng đơn</span>
                    <strong>{formatNumber(metrics.total)}</strong>
                </div>
                <div className="ao-metric">
                    <span>Doanh thu ghi nhận</span>
                    <strong>{formatCurrency(metrics.revenue)}</strong>
                </div>
                <div className="ao-metric">
                    <span>Hoàn tất</span>
                    <strong>{formatNumber(metrics.completed)}</strong>
                </div>
                <div className="ao-metric">
                    <span>Chờ xử lý</span>
                    <strong>{formatNumber(metrics.pending)}</strong>
                </div>
                <div className="ao-metric">
                    <span>Đã huỷ</span>
                    <strong>{formatNumber(metrics.cancelled)}</strong>
                </div>
            </div>

            <div className="ao-toolbar">
                <Input
                    className="ao-search"
                    prefix={<SearchOutlined />}
                    placeholder="Tìm mã đơn, user ID hoặc tên sản phẩm"
                    allowClear
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <Select
                    className="ao-filter"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                        { label: "Tất cả trạng thái", value: "all" },
                        ...ORDER_STATUS_OPTIONS.map((item) => ({
                            label: item.label,
                            value: item.value,
                        })),
                    ]}
                />
            </div>

            <Table
                className="ao-table"
                columns={columns}
                dataSource={filteredOrders}
                rowKey="id"
                loading={loading}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không có đơn hàng phù hợp"
                        />
                    ),
                }}
                expandable={{
                    expandedRowRender: (record) => (
                        <Table
                            columns={itemColumns}
                            dataSource={record.orderItems || []}
                            rowKey={(item) => item.id || `${record.id}-${item.productId}`}
                            pagination={false}
                            size="small"
                            className="ao-items-table"
                        />
                    ),
                }}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: [30, 50, 100],
                    showTotal: (total) => `${formatNumber(total)} đơn hàng`,
                }}
                scroll={{ x: 1100 }}
            />

            <Drawer
                title={<span className="ao-drawer-title">{drawerTitle}</span>}
                open={drawerOpen}
                onClose={closeDrawer}
                width={620}
                destroyOnClose
                className="ao-drawer"
                footer={
                    isReadonly ? (
                        <div className="ao-footer">
                            <Button onClick={closeDrawer}>Đóng</Button>
                        </div>
                    ) : (
                        <div className="ao-footer">
                            <Space>
                                <Button onClick={closeDrawer}>Huỷ</Button>
                                <Button
                                    type="primary"
                                    className="ao-btn-add"
                                    loading={confirmLoading}
                                    onClick={handleSubmit}
                                >
                                    {isCreating ? "Tạo đơn" : "Lưu thay đổi"}
                                </Button>
                            </Space>
                        </div>
                    )
                }
            >
                <Form form={form} layout="vertical" className="ao-form" disabled={isReadonly}>
                    <div className="ao-form-row">
                        <Form.Item
                            name="orderDate"
                            label="Ngày đặt"
                            rules={[{ required: true, message: "Vui lòng chọn ngày đặt" }]}
                        >
                            <Input type="date" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                        >
                            <Select options={ORDER_STATUS_OPTIONS.map(({ label, value }) => ({ label, value }))} />
                        </Form.Item>
                    </div>

                    <div className="ao-form-row">
                        <Form.Item
                            name="userId"
                            label="User ID"
                            rules={isCreating ? [{ required: true, message: "Vui lòng nhập User ID" }] : []}
                        >
                            <InputNumber min={1} style={{ width: "100%" }} disabled={!isCreating || isReadonly} />
                        </Form.Item>
                        <Form.Item name="totalAmount" label="Tổng tiền">
                            <InputNumber
                                min={0}
                                step={1000}
                                style={{ width: "100%" }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value.replace(/,/g, "")}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="notes" label="Ghi chú">
                        <TextArea rows={3} placeholder="Ghi chú xử lý đơn hàng" />
                    </Form.Item>

                    <div className="ao-items-header">
                        <Text strong>Sản phẩm trong đơn</Text>
                        {isCreating && (
                            <Text className="ao-computed-total">
                                Tạm tính: {formatCurrency(computedTotal)}
                            </Text>
                        )}
                    </div>

                    {isCreating ? (
                        <Form.List name="orderItems">
                            {(fields, { add, remove }) => (
                                <div className="ao-order-items">
                                    {fields.map((field) => (
                                        <div className="ao-order-item" key={field.key}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, "productId"]}
                                                label="Sản phẩm"
                                                rules={[{ required: true, message: "Chọn sản phẩm" }]}
                                            >
                                                <Select
                                                    showSearch
                                                    optionFilterProp="label"
                                                    placeholder="Chọn sản phẩm"
                                                    options={productOptions}
                                                    onChange={(value) => handleProductChange(field.name, value)}
                                                />
                                            </Form.Item>
                                            <div className="ao-order-item__row">
                                                <Form.Item
                                                    name={[field.name, "quantity"]}
                                                    label="Số lượng"
                                                    rules={[{ required: true, message: "Nhập số lượng" }]}
                                                >
                                                    <InputNumber min={1} style={{ width: "100%" }} />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[field.name, "price"]}
                                                    label="Đơn giá"
                                                    rules={[{ required: true, message: "Nhập đơn giá" }]}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        step={1000}
                                                        style={{ width: "100%" }}
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                        parser={(value) => value.replace(/,/g, "")}
                                                    />
                                                </Form.Item>
                                                <Button
                                                    danger
                                                    onClick={() => remove(field.name)}
                                                    disabled={fields.length === 1}
                                                >
                                                    Xoá
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add({ quantity: 1 })}>
                                        Thêm sản phẩm
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                    ) : (
                        <Table
                            columns={itemColumns}
                            dataSource={selectedOrder?.orderItems || []}
                            rowKey={(item) => item.id || `${selectedOrder?.id}-${item.productId}`}
                            pagination={false}
                            size="small"
                        />
                    )}
                </Form>
            </Drawer>
        </div>
    );
}
