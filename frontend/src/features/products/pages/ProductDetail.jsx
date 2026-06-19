import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Spin, Alert, Empty, Rate, Tag, Button, Divider, message } from "antd";
import {
    ShoppingCartSimpleIcon,
    StarIcon,
    PackageIcon,
    ShieldCheckIcon,
    TruckIcon,
} from "@phosphor-icons/react";
import { EditOutlined } from "@ant-design/icons";

import productsService from "../services/products.service";
import cartService from "../../cart/service/cart.service";
import useCartStore from "../../../store/cartStore";
import useAuthStore from "../../../store/authStore";
import LoginModal from "../../auth/component/LoginModal";
import RegisterModal from "../../auth/component/RegisterModal";
import ProductSideBar from "../components/ProductSidebar";
import ProductGallery from "../components/ProductGallery";
import ProductHighlights from "../components/ProductHighlights";
import ProductCard from "../components/ProductCard";
import usePromotionStore from "../../../store/promotionStore";
import ProductRatings from "../../rating/component/ProductRatings";
import RatingModal from "../../rating/component/RatingModal";
import "./Products.scss";
import "./ProductDetail.scss";

const RELATED_LIMIT = 12;

const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
        .format(amount || 0)
        .replace("₫", "đ");

function ProductDetail() {
    const { category, id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [related, setRelated] = useState([]);
    const [adding, setAdding] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [refreshRatingsKey, setRefreshRatingsKey] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();
    const setCartCount = useCartStore((s) => s.setCount);
    const user = useAuthStore((s) => s.user);

    const fetchPromotions = usePromotionStore((s) => s.fetchPromotions);
    const promotions = usePromotionStore((s) => s.promotions);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    useEffect(() => {
        if (!id) return;
        let active = true;
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await productsService.getProductById(id);
                if (!active) return;
                setProduct(data);
            } catch (err) {
                if (!active) return;
                const msg = err?.response?.data?.message || err?.message || String(err);
                setError(msg);
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchProduct();
        return () => { active = false; };
    }, [id]);

    const relatedCategory = product?.categoryName || category;
    useEffect(() => {
        if (!relatedCategory) return;
        let active = true;
        const fetchRelated = async () => {
            try {
                const data = await productsService.getProductsByCategoryName(relatedCategory, {
                    page: 0,
                    size: RELATED_LIMIT + 1,
                });
                if (!active) return;
                const items = data?.products || data?.items || [];
                setRelated(items.filter((item) => String(item.id) !== String(id)).slice(0, RELATED_LIMIT));
            } catch {
                if (active) setRelated([]);
            }
        };
        fetchRelated();
        return () => { active = false; };
    }, [relatedCategory, id]);

    const images = useMemo(() => {
        if (!product?.images) return product?.thumbnail ? [product.thumbnail] : [];
        try {
            const parsed = JSON.parse(product.images);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed : (product.thumbnail ? [product.thumbnail] : []);
        } catch {
            return product.thumbnail ? [product.thumbnail] : [];
        }
    }, [product]);

    const specs = useMemo(
        () => (product?.attributes || []).map((attr) => ({ label: attr.attributeName, value: attr.value })),
        [product]
    );

    const handleAddToCart = async () => {
        if (!product?.id) return;
        if (!user) { setOpenLogin(true); return; }
        setAdding(true);
        try {
            const data = await cartService.addToCart(product.id, 1);
            setCartCount(data?.totalItems);
            messageApi.success("Đã thêm sản phẩm vào giỏ hàng.");
        } catch (err) {
            messageApi.error(err?.response?.data?.message || err?.message || "Thêm vào giỏ hàng thất bại.");
        } finally {
            setAdding(false);
        }
    };

    const handleOpenRating = () => {
        if (!user) { setOpenLogin(true); return; }
        setRatingModalOpen(true);
    };

    const handleRatingSubmitted = useCallback(() => {
        setRefreshRatingsKey((k) => k + 1);
        setRatingModalOpen(false);
    }, []);

    const handleScrollRelated = useCallback((direction) => {
        const container = document.querySelector(".product-detail__related-scroll");
        if (container) {
            const scrollAmount = 260;
            container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
        }
    }, []);

    const renderDetail = () => {
        if (loading) {
            return (
                <div className="product-detail__status">
                    <Spin tip="Đang tải sản phẩm..." />
                </div>
            );
        }
        if (error) {
            return (
                <div className="product-detail__status">
                    <Alert message="Lỗi khi tải sản phẩm" description={error} type="error" showIcon />
                </div>
            );
        }
        if (!product) {
            return (
                <div className="product-detail__status">
                    <Empty description="Không tìm thấy sản phẩm" />
                </div>
            );
        }

        const inStock = Number(product.quantity) > 0;

        return (
            <>
                <div className="product-detail__top">
                    <div className="product-detail__gallery">
                        <ProductGallery images={images} />
                    </div>

                    <div className="product-detail__info">
                        <div className="product-detail__breadcrumb">
                            <span>Trang chủ</span>
                            <span className="product-detail__breadcrumb-sep">/</span>
                            <span>{product.categoryName || category}</span>
                            <span className="product-detail__breadcrumb-sep">/</span>
                            <span className="product-detail__breadcrumb-current">{product.name}</span>
                        </div>

                        <h1 className="product-detail__name">{product.name}</h1>

                        <div className="product-detail__meta-row">
                            {product.brandName && (
                                <span className="product-detail__brand">
                                    Thương hiệu: <strong>{product.brandName}</strong>
                                </span>
                            )}
                            {product.categoryName && <Tag color="blue">{product.categoryName}</Tag>}
                        </div>

                        <div className="product-detail__rating-row">
                            <div className="product-detail__rating-stars">
                                <Rate disabled allowHalf value={product.averageScore || 0} />
                                <span className="product-detail__score">
                                    {product.averageScore ? Number(product.averageScore).toFixed(1) : "Chưa có đánh giá"}
                                </span>
                            </div>
                            <button className="product-detail__write-review" onClick={handleOpenRating}>
                                <EditOutlined /> Viết đánh giá
                            </button>
                        </div>

                        {(() => {
                            const promo = promotions.find((p) => String(p.productId) === String(product.id));
                            const hasPromo = promo && promo.discountPercent > 0;
                            const oldPrice = product.price;
                            const newPrice = hasPromo ? Math.round((product.price * (100 - promo.discountPercent)) / 100) : product.price;
                            const discountPercent = hasPromo ? promo.discountPercent : 0;

                            return (
                                <div className="product-detail__price-block">
                                    <span className="product-detail__price">{formatCurrency(newPrice)}</span>
                                    {hasPromo && (
                                        <>
                                            <span className="product-detail__old-price" style={{ textDecoration: 'line-through', color: '#9ca3af', marginLeft: '8px', fontSize: '0.9em' }}>
                                                {formatCurrency(oldPrice)}
                                            </span>
                                            <Tag color="red" style={{ marginLeft: '8px' }}>
                                                -{discountPercent}%
                                            </Tag>
                                        </>
                                    )}
                                    <span className={`product-detail__stock-tag ${inStock ? "in-stock" : "out-stock"}`} style={{ marginLeft: 'auto' }}>
                                        {inStock ? (
                                            <><PackageIcon size={14} weight="fill" /> Còn hàng</>
                                        ) : (
                                            "Hết hàng"
                                        )}
                                    </span>
                                </div>
                            );
                        })()}

                        <div className="product-detail__actions">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartSimpleIcon size={18} weight="fill" />}
                                onClick={handleAddToCart}
                                loading={adding}
                                disabled={!inStock}
                                className="product-detail__btn-cart"
                            >
                                Thêm vào giỏ hàng
                            </Button>
                        </div>

                        <div className="product-detail__perks">
                            <div className="product-detail__perk">
                                <TruckIcon size={20} weight="duotone" />
                                <span>Miễn phí giao hàng</span>
                            </div>
                            <div className="product-detail__perk">
                                <ShieldCheckIcon size={20} weight="duotone" />
                                <span>Bảo hành chính hãng</span>
                            </div>
                            <div className="product-detail__perk">
                                <PackageIcon size={20} weight="duotone" />
                                <span>Đổi trả 30 ngày</span>
                            </div>
                        </div>

                        {product.description && (
                            <div className="product-detail__description-block">
                                <h3 className="product-detail__section-title">Mô tả sản phẩm</h3>
                                <p className="product-detail__description">{product.description}</p>
                            </div>
                        )}

                        {specs.length > 0 && <ProductHighlights specs={specs} />}
                    </div>
                </div>

                <div className="product-detail__reviews-section">
                    <div className="product-detail__section-header">
                        <StarIcon size={22} weight="fill" className="product-detail__section-icon" />
                        <h3 className="product-detail__section-title">Đánh giá sản phẩm</h3>
                    </div>
                    <ProductRatings productId={product.id} refreshKey={refreshRatingsKey} />
                </div>

                {related.length > 0 && (
                    <section className="product-detail__related">
                        <div className="product-detail__related-header">
                            <h2 className="product-detail__related-title">Sản phẩm tương tự</h2>
                            <div className="product-detail__related-arrows">
                                <button
                                    className="product-detail__arrow-btn"
                                    onClick={() => handleScrollRelated(-1)}
                                >
                                    &#8249;
                                </button>
                                <button
                                    className="product-detail__arrow-btn"
                                    onClick={() => handleScrollRelated(1)}
                                >
                                    &#8250;
                                </button>
                            </div>
                        </div>
                        <div className="product-detail__related-scroll">
                            {related.map((item) => (
                                <div key={item.id || item._id || item.code} className="product-detail__related-item">
                                    <ProductCard product={item} categoryName={relatedCategory} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </>
        );
    };

    return (
        <div className="productLayout">
            {contextHolder}
            <ProductSideBar />
            <div className="product-detail">{renderDetail()}</div>

            <LoginModal
                open={openLogin}
                onCancel={() => setOpenLogin(false)}
                onOpenRegister={() => { setOpenLogin(false); setOpenRegister(true); }}
            />
            <RegisterModal
                open={openRegister}
                onCancel={() => setOpenRegister(false)}
                onOpenLogin={() => { setOpenRegister(false); setOpenLogin(true); }}
            />
            {product && (
                <RatingModal
                    open={ratingModalOpen}
                    product={{ productId: product.id, productName: product.name }}
                    onClose={() => setRatingModalOpen(false)}
                    onSubmitted={handleRatingSubmitted}
                />
            )}
        </div>
    );
}

export default ProductDetail;
