import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Alert, Button, Empty, Popconfirm, message } from "antd";
import { Trash } from "@phosphor-icons/react";

import CheckoutSteps from "../../../components/ui/CheckoutStep";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import cartService from "../service/cart.service";
import useCartStore from "../../../store/cartStore";
import usePromotionStore from "../../../store/promotionStore";
import "./Cart.scss";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mutating, setMutating] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const setCartCount = useCartStore((s) => s.setCount);

    const promotions = usePromotionStore((s) => s.promotions);
    const fetchPromotions = usePromotionStore((s) => s.fetchPromotions);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    useEffect(() => {
        let active = true;
        const fetchCart = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await cartService.getCart();
                if (active) {
                    setCart(data);
                    setCartCount(data?.totalItems);
                }
            } catch (err) {
                if (active) {
                    const msg = err?.response?.data?.message || err?.message || String(err);
                    setError(msg);
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchCart();
        return () => {
            active = false;
        };
    }, [setCartCount]);

    // Map CartItemDTO (backend) -> shape mà CartItem mong đợi kèm khuyến mãi
    const items = useMemo(() => {
        return (cart?.items || []).map((it) => {
            const promo = promotions.find((p) => String(p.productId) === String(it.productId));
            const hasPromo = promo && promo.discountPercent > 0;
            const originalPrice = it.price;
            const discountedPrice = hasPromo
                ? (() => {
                      const raw = (it.price * (100 - promo.discountPercent)) / 100;
                      const rounded = Math.round(raw / 10000) * 10000;
                      return rounded > 0 ? rounded : Math.round(raw);
                  })()
                : it.price;

            return {
                id: it.id,
                productId: it.productId,
                name: it.productName,
                image: it.thumbnail,
                price: discountedPrice,
                originalPrice: originalPrice,
                discountPercent: hasPromo ? promo.discountPercent : 0,
                quantity: it.quantity,
            };
        });
    }, [cart, promotions]);

    const subtotal = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

    const handleQuantityChange = async (cartItemId, quantity) => {
        if (mutating) return;
        setMutating(true);
        try {
            const data = await cartService.updateCartItem(cartItemId, quantity);
            setCart(data);
            setCartCount(data?.totalItems);
        } catch (err) {
            messageApi.error(err?.response?.data?.message || "Cập nhật số lượng thất bại.");
        } finally {
            setMutating(false);
        }
    };

    const handleRemove = async (cartItemId) => {
        if (mutating) return;
        setMutating(true);
        try {
            const data = await cartService.removeCartItem(cartItemId);
            setCart(data);
            setCartCount(data?.totalItems);
            messageApi.success("Đã xoá sản phẩm khỏi giỏ hàng.");
        } catch (err) {
            messageApi.error(err?.response?.data?.message || "Xoá sản phẩm thất bại.");
        } finally {
            setMutating(false);
        }
    };

    const handleClear = async () => {
        if (mutating) return;
        setMutating(true);
        try {
            await cartService.clearCart();
            setCart((prev) => ({ ...prev, items: [], amount: 0, totalItems: 0 }));
            setCartCount(0);
            messageApi.success("Đã xoá toàn bộ giỏ hàng.");
        } catch (err) {
            messageApi.error(err?.response?.data?.message || "Xoá giỏ hàng thất bại.");
        } finally {
            setMutating(false);
        }
    };

    const handleCheckout = () => navigate("/checkout");
    const handleContinue = () => navigate("/");

    const renderBody = () => {
        if (loading) {
            return (
                <div className="cart-page__status">
                    <Spin description="Đang tải giỏ hàng..." />
                </div>
            );
        }

        if (error) {
            return (
                <div className="cart-page__status">
                    <Alert message="Lỗi khi tải giỏ hàng" description={error} type="error" showIcon />
                </div>
            );
        }

        if (items.length === 0) {
            return (
                <div className="cart-page__status">
                    <Empty description="Giỏ hàng của bạn đang trống">
                        <Button className="cart-page__empty-btn" onClick={handleContinue}>
                            Tiếp tục mua hàng
                        </Button>
                    </Empty>
                </div>
            );
        }

        return (
            <div className="cart-page__content">
                <div className="cart-page__items">
                    <div className="cart-page__items-head">
                        <span className="cart-page__items-title">
                            Sản phẩm ({cart?.totalItems ?? items.length})
                        </span>
                        <Popconfirm
                            title="Xoá toàn bộ giỏ hàng?"
                            okText="Xoá hết"
                            cancelText="Huỷ"
                            okButtonProps={{ danger: true }}
                            onConfirm={handleClear}
                        >
                            <button className="cart-page__clear" disabled={mutating}>
                                <Trash size={16} />
                                <span>Xoá tất cả</span>
                            </button>
                        </Popconfirm>
                    </div>

                    <div className={`cart-page__list${mutating ? " is-busy" : ""}`}>
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                </div>

                <aside className="cart-page__summary">
                    <CartSummary
                        subtotal={subtotal}
                        shippingFee={0}
                        onCheckout={handleCheckout}
                        onContinue={handleContinue}
                    />
                </aside>
            </div>
        );
    };

    return (
        <div className="cart-page">
            {contextHolder}
            <CheckoutSteps currentStep={1} />
            <h1 className="cart-page__title">Giỏ hàng</h1>
            {renderBody()}
        </div>
    );
}

export default Cart;
