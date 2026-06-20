import { useState } from 'react';
import {
    CalendarOutlined,
    FileTextOutlined,
    ShoppingOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    SyncOutlined,
    CarFilled,
    CloseCircleFilled,
    StarOutlined,
} from '@ant-design/icons';
import RatingModal from '../../rating/component/RatingModal';
import './OrderDetail.scss';

/**
 * Map trạng thái đơn hàng sang tiếng Việt + icon + màu
 */
const STATUS_MAP = {
    new: {
        label: 'Mới',
        icon: <ClockCircleFilled />,
        color: 'blue',
    },
    processing: {
        label: 'Đang xử lý',
        icon: <SyncOutlined spin />,
        color: 'orange',
    },
    shipping: {
        label: 'Đang vận chuyển',
        icon: <CarFilled />,
        color: 'purple',
    },
    completed: {
        label: 'Hoàn thành',
        icon: <CheckCircleFilled />,
        color: 'green',
    },
    cancelled: {
        label: 'Huỷ',
        icon: <CloseCircleFilled />,
        color: 'red',
    },
};

/**
 * Các bước tiến trình đơn hàng
 */
const STEPS = ['new', 'processing', 'shipping', 'completed'];

/**
 * Format tiền VND
 */
const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + 'đ';
};

/**
 * Format ngày
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

/**
 * Component hiển thị toàn bộ thông tin đơn hàng
 *
 * @param {object} order - Dữ liệu đơn hàng từ backend
 *   { id, orderDate, totalAmount, status, notes, userId, orderItems: [{ id, quantity, price, productId, productName }] }
 */
const OrderDetail = ({ order }) => {
    const [ratingProduct, setRatingProduct] = useState(null);

    if (!order) return null;

    const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.new;
    const isCancelled = order.status === 'cancelled';
    // Chỉ cho phép đánh giá sản phẩm khi đơn hàng đã hoàn thành
    const canRate = order.status === 'completed';

    // Tính step hiện tại cho progress
    const currentStepIndex = STEPS.indexOf(order.status);

    return (
        <div className="order-detail">
            {/* === HEADER === */}
            <div className="order-detail__header">
                <div className="order-detail__header-left">
                    <h2 className="order-detail__title">
                        <ShoppingOutlined /> Chi tiết đơn hàng
                    </h2>
                    <span className="order-detail__id">#{order.id}</span>
                </div>
                <div className={`order-detail__status order-detail__status--${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                </div>
            </div>

            {/* === PROGRESS BAR (chỉ hiện khi không bị huỷ) === */}
            {!isCancelled && (
                <div className="order-detail__progress">
                    {STEPS.map((step, idx) => {
                        const info = STATUS_MAP[step];
                        const isActive = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        return (
                            <div
                                key={step}
                                className={`order-detail__step ${isActive ? 'order-detail__step--active' : ''} ${isCurrent ? 'order-detail__step--current' : ''}`}
                            >
                                <div className="order-detail__step-dot">
                                    {isActive ? <CheckCircleFilled /> : <span className="order-detail__step-circle" />}
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className={`order-detail__step-line ${isActive && idx < currentStepIndex ? 'order-detail__step-line--active' : ''}`} />
                                )}
                                <span className="order-detail__step-label">{info.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* === CANCELLED NOTICE === */}
            {isCancelled && (
                <div className="order-detail__cancelled-notice">
                    <CloseCircleFilled />
                    <span>Đơn hàng này đã bị huỷ</span>
                </div>
            )}

            {/* === INFO CARDS === */}
            <div className="order-detail__info-row">
                <div className="order-detail__info-card">
                    <div className="order-detail__info-icon">
                        <CalendarOutlined  size={20}/>
                    </div>
                    <div>
                        <span className="order-detail__info-label">Ngày đặt hàng</span>
                        <span className="order-detail__info-value">{formatDate(order.orderDate)}</span>
                    </div>
                </div>
                <div className="order-detail__info-card">
                    <div className="order-detail__info-icon">
                        <FileTextOutlined size={20}/>
                    </div>
                    <div>
                        <span className="order-detail__info-label">Ghi chú</span>
                        <span className="order-detail__info-value">{order.notes || '-'}</span>
                    </div>
                </div>
            </div>

            {/* === PRODUCT TABLE === */}
            <div className="order-detail__section">
                <h3 className="order-detail__section-title">
                    <ShoppingOutlined /> Sản phẩm đã đặt
                </h3>
                <table className="order-detail__table">
                    <thead>
                        <tr>
                            <th className="order-detail__th order-detail__th--stt">#</th>
                            <th className="order-detail__th order-detail__th--name">Sản phẩm</th>
                            <th className="order-detail__th order-detail__th--price">Đơn giá</th>
                            <th className="order-detail__th order-detail__th--qty">Số lượng</th>
                            <th className="order-detail__th order-detail__th--subtotal">Thành tiền</th>
                            {canRate && (
                                <th className="order-detail__th order-detail__th--rate">Đánh giá</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems?.map((item, idx) => (
                            <tr key={item.id || idx} className="order-detail__tr">
                                <td className="order-detail__td order-detail__td--stt">{idx + 1}</td>
                                <td className="order-detail__td order-detail__td--name">{item.productName}</td>
                                <td className="order-detail__td order-detail__td--price">{formatPrice(item.price)}</td>
                                <td className="order-detail__td order-detail__td--qty">{item.quantity}</td>
                                <td className="order-detail__td order-detail__td--subtotal">
                                    {formatPrice(item.price * item.quantity)}
                                </td>
                                {canRate && (
                                    <td className="order-detail__td order-detail__td--rate">
                                        <button
                                            className="order-detail__rate-btn"
                                            onClick={() =>
                                                setRatingProduct({
                                                    productId: item.productId,
                                                    productName: item.productName,
                                                })
                                            }
                                        >
                                            <StarOutlined /> Đánh giá
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* === SUMMARY === */}
            <div className="order-detail__summary">
                <div className="order-detail__summary-row">
                    <span>Tạm tính ({order.orderItems?.length || 0} sản phẩm)</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="order-detail__summary-row">
                    <span>Phí vận chuyển</span>
                    <span className="order-detail__free-ship">Miễn phí</span>
                </div>
                <div className="order-detail__summary-total">
                    <span>Tổng cộng</span>
                    <span className="order-detail__total-price">{formatPrice(order.totalAmount)}</span>
                </div>
            </div>

            {/* === RATING MODAL === */}
            <RatingModal
                open={!!ratingProduct}
                product={ratingProduct}
                onClose={() => setRatingProduct(null)}
            />
        </div>
    );
};

export default OrderDetail;
