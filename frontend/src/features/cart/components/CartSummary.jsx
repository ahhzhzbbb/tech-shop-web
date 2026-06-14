import { ShoppingCart, ArrowLeft } from "@phosphor-icons/react";
import "./CartSummary.scss";

const CartSummary = ({
  subtotal = 0,
  shippingFee = 0,
  onCheckout,
  onContinue,
}) => {
  const total = subtotal + shippingFee;

  const fmt = (amount) =>
    amount.toLocaleString("vi-VN") + "₫";

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Tóm tắt đơn hàng</h3>

      <div className="order-summary__rows">
        <div className="order-summary__row">
          <span className="order-summary__row-label">Tạm tính</span>
          <span className="order-summary__row-value">{fmt(subtotal)}</span>
        </div>

        <div className="order-summary__row">
          <span className="order-summary__row-label">Phí vận chuyển</span>
          <span className="order-summary__row-value">
            {shippingFee === 0
              ? <span className="order-summary__free">Miễn phí</span>
              : fmt(shippingFee)
            }
          </span>
        </div>
      </div>

      <div className="order-summary__divider" />

      <div className="order-summary__total">
        <span className="order-summary__total-label">Tổng cộng</span>
        <span className="order-summary__total-value">{fmt(total)}</span>
      </div>

      <div className="order-summary__actions">
        <button className="order-summary__btn-checkout" onClick={onCheckout}>
          <ShoppingCart size={18} weight="fill" />
          Mua ngay
        </button>

        <button className="order-summary__btn-continue" onClick={onContinue}>
          <ArrowLeft size={16} />
          Tiếp tục mua hàng
        </button>
      </div>
    </div>
  );
};

export default CartSummary;