import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GiftFilled,
    StarFilled,
} from '@ant-design/icons';
import usePromotionStore from '../../../store/promotionStore';
import './ProductCard.scss';

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(amount)
        .replace('₫', 'đ');
};

const ProductCard = ({ product, categoryName }) => {
    const navigate = useNavigate();
    const fetchPromotions = usePromotionStore((s) => s.fetchPromotions);
    const promotions = usePromotionStore((s) => s.promotions);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    if (!product) return null;

    const { id, name, thumbnail, price, averageScore, reviewsCount, attributes } = product;

    const promo = promotions.find((p) => String(p.productId) === String(id));
    const hasPromo = promo && promo.discountPercent > 0;
    const oldPrice = price;
    const newPrice = hasPromo ? Math.round((price * (100 - promo.discountPercent)) / 100) : price;
    const discountPercent = hasPromo ? promo.discountPercent : 0;

    const category = categoryName || product.categoryName;

    // Chỉ hiển thị điểm khi sản phẩm thực sự có đánh giá
    const hasRating = averageScore != null && Number(averageScore) > 0;

    const handleClick = () => {
        if (id == null) return;
        navigate(`/products/${encodeURIComponent(category)}/${id}`);
    };

    return (
        <div
            className="product-card"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            {/* Gift Icon Badge */}
            <div className="product-card__badge-gift">
                <GiftFilled />
            </div>

            {/* Product Image */}
            <div className="product-card__image-container">
                <img src={thumbnail} alt={name} className="product-card__image" />
            </div>

            <div className="product-card__content">
                {/* Product Name */}
                <h3 className="product-card__name" title={name}>
                    {name}
                </h3>

                {/* Specs Box */}
                {attributes && attributes.length > 0 && (
                    <div className="product-card__specs">
                        {attributes.map((attr, index) => (
                            <div key={index} className="spec-item">
                                <span className="spec-icon">{attr.icon || <div className="spec-dot" />}</span>
                                <span className="spec-text">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Price Section */}
                <div className="product-card__price-section">
                    {discountPercent > 0 && (
                        <div className="product-card__old-price">
                            {formatCurrency(oldPrice)}
                        </div>
                    )}
                    <div className="product-card__price-row">
                        <span className="product-card__new-price">{formatCurrency(newPrice)}</span>
                        {discountPercent > 0 && (
                            <span className="product-card__discount">-{discountPercent}%</span>
                        )}
                    </div>
                </div>

                {/* Rating Section */}
                <div className="product-card__rating">
                    {hasRating ? (
                        <>
                            <span className="rating-score">{Number(averageScore).toFixed(1)}</span>
                            <StarFilled className="rating-star" />
                            {reviewsCount > 0 && (
                                <span className="rating-count">({reviewsCount} đánh giá)</span>
                            )}
                        </>
                    ) : (
                        <span className="rating-empty">Chưa có đánh giá</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;