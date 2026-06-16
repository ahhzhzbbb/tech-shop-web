import { useState } from 'react';
import {
    EyeOutlined,
    ClockCircleFilled,
    SyncOutlined,
    CarFilled,
    CheckCircleFilled,
    CloseCircleFilled,
    ArrowLeftOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import OrderDetail from './OrderDetail';
import './OrderTable.scss';

/**
 * Map trạng thái → label + icon + màu
 */
const STATUS_CONFIG = {
    new: { label: 'Mới', icon: <ClockCircleFilled />, color: 'blue' },
    processing: { label: 'Đang xử lý', icon: <SyncOutlined />, color: 'orange' },
    shipping: { label: 'Đang vận chuyển', icon: <CarFilled />, color: 'purple' },
    completed: { label: 'Hoàn thành', icon: <CheckCircleFilled />, color: 'green' },
    cancelled: { label: 'Huỷ', icon: <CloseCircleFilled />, color: 'red' },
};

/**
 * Format tiền VND
 */
const formatPrice = (price) => {
    if (!price && price !== 0) return '—';
    return price.toLocaleString('vi-VN') + 'đ';
};

/**
 * Format ngày
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

/**
 * Component bảng hiển thị tất cả đơn hàng
 * Bấm vào 1 đơn sẽ hiện OrderDetail
 *
 * @param {Array} orders - Mảng đơn hàng từ backend
 *   [{ id, orderDate, totalAmount, status, notes, userId, orderItems: [...] }]
 */
const OrderTable = ({ orders = [] }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Nếu đang xem chi tiết 1 đơn
    if (selectedOrder) {
        return (
            <div className="order-table-wrapper">
                <div className="order-table__back-btn-container" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '32px', marginBottom: '32px' }}>
                    <button
                        className="order-table__back-btn"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <ArrowLeftOutlined /> Quay lại danh sách
                    </button>
                </div>
                <OrderDetail order={selectedOrder} />
            </div>
        );
    }

    // Danh sách đơn hàng
    return (
        <div className="order-table-wrapper">
            <div className="order-table">
                {/* Header */}
                <div className="order-table__header">
                    <h2 className="order-table__title">
                        <ShoppingOutlined /> Đơn hàng của bạn
                    </h2>
                    <span className="order-table__count">{orders.length} đơn hàng</span>
                </div>

                {/* Table */}
                {orders.length === 0 ? (
                    <div className="order-table__empty">
                        <ShoppingOutlined className="order-table__empty-icon" />
                        <p>Bạn chưa có đơn hàng nào.</p>
                    </div>
                ) : (
                    <table className="order-table__table">
                        <thead>
                            <tr>
                                <th className="order-table__th">Mã đơn</th>
                                <th className="order-table__th">Ngày đặt</th>
                                <th className="order-table__th">Sản phẩm</th>
                                <th className="order-table__th order-table__th--right">Tổng tiền</th>
                                <th className="order-table__th order-table__th--center">Trạng thái</th>
                                <th className="order-table__th order-table__th--center">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.new;
                                const productSummary = order.orderItems
                                    ?.map(item => item.productName)
                                    .join(', ') || '—';
                                const itemCount = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                                return (
                                    <tr
                                        key={order.id}
                                        className="order-table__row"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <td className="order-table__td order-table__td--id">
                                            #{order.id}
                                        </td>
                                        <td className="order-table__td order-table__td--date">
                                            {formatDate(order.orderDate)}
                                        </td>
                                        <td className="order-table__td order-table__td--products">
                                            <span className="order-table__product-text">
                                                {productSummary.length > 60
                                                    ? productSummary.slice(0, 60) + '...'
                                                    : productSummary}
                                            </span>
                                            <span className="order-table__product-count">
                                                {itemCount} sản phẩm
                                            </span>
                                        </td>
                                        <td className="order-table__td order-table__td--total">
                                            {formatPrice(order.totalAmount)}
                                        </td>
                                        <td className="order-table__td order-table__td--status">
                                            <span className={`order-table__badge order-table__badge--${status.color}`}>
                                                {status.icon}
                                                <span>{status.label}</span>
                                            </span>
                                        </td>
                                        <td className="order-table__td order-table__td--action">
                                            <button
                                                className="order-table__view-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                }}
                                                title="Xem chi tiết"
                                            >
                                                <EyeOutlined />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrderTable;
