import React from 'react';
import {
    GiftFilled,
    StarFilled,
} from '@ant-design/icons';
import './ProductCard.scss';

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(amount)
        .replace('₫', 'đ');
};

const ProductCard = ({ product }) => {
    if (!product) return null;

    const { name, thumbnail, price, salePrice, discount, averageScore, reviewsCount, attributes } = product;

    const oldPrice = price;
    const newPrice = salePrice || price;
    const discountPercent = discount || (oldPrice > newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0);

    return (
        <div className="product-card">
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
                    <span className="rating-score">{averageScore?.toFixed(1)}</span>
                    <StarFilled className="rating-star" />
                    <span className="rating-count">({reviewsCount} đánh giá)</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;