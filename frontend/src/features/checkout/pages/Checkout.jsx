import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Alert, Form, Input, Radio, Button, message } from "antd";
import { CreditCard, Money } from "@phosphor-icons/react";

import CheckoutSteps from "../../../components/ui/CheckoutStep";
import cartService from "../../cart/service/cart.service";
import orderService from "../../order/services/order.service.jsx";
import paymentService from "../services/payment.service.jsx";
import useAuthStore from "../../../store/authStore";
import useCartStore from "../../../store/cartStore";
import "./Checkout.scss";

const fmt = (amount) => (Number(amount) || 0).toLocaleString("vi-VN") + "₫";

// orderDate dạng yyyy-MM-dd (LocalDate ở backend)
const todayIso = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

function Checkout() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const user = useAuthStore((s) => s.user);
    const setCartCount = useCartStore((s) => s.setCount);

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Tải giỏ hàng
    useEffect(() => {
        let active = true;
        const fetchCart = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await cartService.getCart();
                if (!active) return;
                setCart(data);
                setCartCount(data?.totalItems);
                if (!data?.items?.length) {
                    messageApi.info("Giỏ hàng trống, vui lòng chọn sản phẩm.");
                    navigate("/cart");
                }
            } catch (err) {
                if (active) setError(err?.response?.data?.message || err?.message || String(err));
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchCart();
        return () => {
            active = false;
        };
    }, [navigate, setCartCount, messageApi]);

    // Prefill thông tin người nhận từ store
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                recipientName: user.fullName || user.username || "",
                recipientPhone: user.phoneNumber || "",
                shippingAddress: user.address || "",
                paymentMethod: "COD",
            });
        }
    }, [user, form]);

    const items = useMemo(() => cart?.items || [], [cart]);
    const subtotal = cart?.amount ?? 0;

    const handleSubmit = async (values) => {
        if (!user?.id) {
            messageApi.error("Bạn cần đăng nhập để đặt hàng.");
            return;
        }
        if (!items.length) {
            messageApi.error("Giỏ hàng trống.");
            return;
        }

        setSubmitting(true);
        try {
            // 1) Tạo đơn hàng
            const order = await orderService.createOrder({
                userId: user.id,
                orderDate: todayIso(),
                totalAmount: subtotal,
                status: "PENDING",
                notes: values.notes || "",
                recipientName: values.recipientName,
                recipientPhone: values.recipientPhone,
                shippingAddress: values.shippingAddress,
                orderItems: items.map((it) => ({
                    productId: it.productId,
                    quantity: it.quantity,
                    price: it.price,
                })),
            });

            // 2) Tạo thanh toán
            const payment = await paymentService.createPayment({
                orderId: order.id,
                paymentMethod: values.paymentMethod,
            });

            // 3) Điều hướng theo phương thức
            if (values.paymentMethod === "VNPAY") {
                if (payment?.paymentUrl) {
                    window.location.href = payment.paymentUrl;
                    return;
                }
                throw new Error("Không lấy được liên kết thanh toán VNPay.");
            }

            // COD: xoá giỏ và sang trang hoàn tất
            try {
                await cartService.clearCart();
                setCartCount(0);
            } catch {
                /* không chặn luồng nếu xoá giỏ lỗi */
            }
            navigate(`/checkout/success?orderId=${order.id}&method=COD`);
        } catch (err) {
            messageApi.error(err?.response?.data?.message || err?.message || "Đặt hàng thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderBody = () => {
        if (loading) {
            return (
                <div className="checkout-page__status">
                    <Spin tip="Đang tải..." />
                </div>
            );
        }
        if (error) {
            return (
                <div className="checkout-page__status">
                    <Alert message="Lỗi" description={error} type="error" showIcon />
                </div>
            );
        }

        return (
            <div className="checkout-page__content">
                <Form
                    form={form}
                    layout="vertical"
                    className="checkout-page__form"
                    onFinish={handleSubmit}
                    requiredMark={false}
                >
                    <section className="checkout-card">
                        <h3 className="checkout-card__title">Thông tin người nhận</h3>

                        <Form.Item
                            label="Họ và tên"
                            name="recipientName"
                            rules={[{ required: true, message: "Vui lòng nhập họ tên người nhận." }]}
                        >
                            <Input placeholder="Nguyễn Văn A" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="recipientPhone"
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại." },
                                {
                                    pattern: /^(0|\+84)\d{9,10}$/,
                                    message: "Số điện thoại không hợp lệ.",
                                },
                            ]}
                        >
                            <Input placeholder="0901234567" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ giao hàng"
                            name="shippingAddress"
                            rules={[{ required: true, message: "Vui lòng nhập địa chỉ giao hàng." }]}
                        >
                            <Input.TextArea
                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                            />
                        </Form.Item>

                        <Form.Item label="Ghi chú (tuỳ chọn)" name="notes">
                            <Input.TextArea
                                placeholder="Ghi chú cho người bán..."
                                autoSize={{ minRows: 2, maxRows: 3 }}
                            />
                        </Form.Item>
                    </section>

                    <section className="checkout-card">
                        <h3 className="checkout-card__title">Phương thức thanh toán</h3>
                        <Form.Item name="paymentMethod" initialValue="COD" className="checkout-page__methods">
                            <Radio.Group className="checkout-methods">
                                <Radio.Button value="COD" className="checkout-method">
                                    <Money size={18} /> Thanh toán khi nhận hàng (COD)
                                </Radio.Button>
                                <Radio.Button value="VNPAY" className="checkout-method">
                                    <CreditCard size={18} /> Thanh toán qua VNPay
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </section>
                </Form>

                <aside className="checkout-page__summary">
                    <div className="checkout-card">
                        <h3 className="checkout-card__title">Đơn hàng ({cart?.totalItems ?? items.length})</h3>

                        <div className="checkout-summary__items">
                            {items.map((it) => (
                                <div key={it.id} className="checkout-summary__item">
                                    <img src={it.thumbnail} alt={it.productName} />
                                    <div className="checkout-summary__item-info">
                                        <span className="checkout-summary__item-name">{it.productName}</span>
                                        <span className="checkout-summary__item-qty">x{it.quantity}</span>
                                    </div>
                                    <span className="checkout-summary__item-price">
                                        {fmt((it.price || 0) * (it.quantity || 0))}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-summary__divider" />

                        <div className="checkout-summary__row">
                            <span>Tạm tính</span>
                            <span>{fmt(subtotal)}</span>
                        </div>
                        <div className="checkout-summary__row">
                            <span>Phí vận chuyển</span>
                            <span className="checkout-summary__free">Miễn phí</span>
                        </div>

                        <div className="checkout-summary__total">
                            <span>Tổng cộng</span>
                            <span className="checkout-summary__total-value">{fmt(subtotal)}</span>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            block
                            loading={submitting}
                            onClick={() => form.submit()}
                            className="checkout-page__submit"
                        >
                            Đặt hàng
                        </Button>
                        <Button
                            type="link"
                            block
                            onClick={() => navigate("/cart")}
                            className="checkout-page__back"
                        >
                            Quay lại giỏ hàng
                        </Button>
                    </div>
                </aside>
            </div>
        );
    };

    return (
        <div className="checkout-page">
            {contextHolder}
            <CheckoutSteps currentStep={2} />
            <h1 className="checkout-page__title">Thông tin đặt hàng</h1>
            {renderBody()}
        </div>
    );
}

export default Checkout;
