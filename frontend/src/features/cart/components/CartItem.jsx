import { Minus, Plus, Trash } from "@phosphor-icons/react";
import { Button } from 'antd';
import "./CartItem.scss";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { id, name, image, price, quantity } = item;

  const handleDecrease = () => {
    if (quantity > 1) onQuantityChange(id, quantity - 1);
  };

  const handleIncrease = () => {
    onQuantityChange(id, quantity + 1);
  };

  const formattedPrice = price.toLocaleString("vi-VN") + "₫";
  const formattedTotal = (price * quantity).toLocaleString("vi-VN") + "₫";

  return (
    <div className="cart-item">
      {/* 1. Ảnh sản phẩm */}
      <div className="cart-item__image">
        <img src={image} alt={name} />
      </div>

      {/* 2. Tên + điều chỉnh số lượng */}
      <div className="cart-item__info">
        <p className="cart-item__name">{name}</p>
        <div className="cart-item__qty">
          <button
            className="cart-item__qty-btn"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Giảm số lượng"
          >
            <Minus size={14} weight="bold" />
          </button>
          <span className="cart-item__qty-value">{quantity}</span>
          <button
            className="cart-item__qty-btn"
            onClick={handleIncrease}
            aria-label="Tăng số lượng"
          >
            <Plus size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* 3. Giá + nút Xoá */}
      <div className="cart-item__actions">
        <div className="cart-item__pricing">
          <span className="cart-item__total">{formattedTotal}</span>
          <span className="cart-item__unit-price">{formattedPrice} / sp</span>
        </div>
        <Button
          className="cart-item__remove"
          onClick={() => onRemove(id)}
          aria-label="Xoá sản phẩm"
        >
          <Trash size={16} />
          <span>Xoá</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItem;