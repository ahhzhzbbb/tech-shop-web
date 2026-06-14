import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Result, Button, Spin } from "antd";

import CheckoutSteps from "../../../components/ui/CheckoutStep";
import paymentService from "../services/payment.service";
import useCartStore from "../../../store/cartStore";
import "./Checkout.scss";

/**
 * Trang kết quả đặt hàng (bước 4 - Hoàn tất).
 * - COD: hiển thị thành công ngay (điều hướng từ Checkout, path /checkout/success).
 * - VNPay: VNPay redirect về /checkout/vnpay-return kèm tham số vnp_*; trang sẽ gọi
 *   backend để xác thực chữ ký + cập nhật DB, rồi hiển thị kết quả.
 */
function CheckoutResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const setCartCount = useCartStore((s) => s.setCount);

    const isVnpayReturn = location.pathname.includes("vnpay-return");

    const [loading, setLoading] = useState(isVnpayReturn);
    const [success, setSuccess] = useState(!isVnpayReturn);
    const [orderId, setOrderId] = useState(searchParams.get("orderId") || null);
    const [errMsg, setErrMsg] = useState(null);
    const handled = useRef(false);

    useEffect(() => {
        if (!isVnpayReturn || handled.current) return;
        handled.current = true;

        const verify = async () => {
            try {
                const data = await paymentService.verifyVnpayReturn(location.search);
                const ok = data?.status === "success";
                setSuccess(ok);
                if (data?.payment?.orderId) setOrderId(data.payment.orderId);
                if (!ok) setErrMsg(data?.message || "Thanh toán không thành công.");
                if (ok) setCartCount(0);
            } catch (err) {
                setSuccess(false);
                setErrMsg(err?.response?.data?.message || err?.message || "Không xác thực được giao dịch.");
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [isVnpayReturn, location.search, setCartCount]);

    if (loading) {
        return (
            <div className="checkout-page">
                <CheckoutSteps currentStep={4} />
                <div className="checkout-page__status">
                    <Spin tip="Đang xác nhận thanh toán..." />
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <CheckoutSteps currentStep={4} />
            <Result
                status={success ? "success" : "error"}
                title={success ? "Đặt hàng thành công!" : "Thanh toán thất bại"}
                subTitle={
                    success
                        ? orderId
                            ? `Mã đơn hàng của bạn: #${orderId}`
                            : "Cảm ơn bạn đã mua hàng."
                        : errMsg
                }
                extra={[
                    <Button type="primary" key="orders" onClick={() => navigate("/orders")}>
                        Xem đơn hàng của tôi
                    </Button>,
                    <Button key="home" onClick={() => navigate("/")}>
                        Tiếp tục mua sắm
                    </Button>,
                ]}
            />
        </div>
    );
}

export default CheckoutResult;
