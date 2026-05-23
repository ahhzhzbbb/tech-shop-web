import React from 'react';
import { 
    GiftFilled, 
    StarFilled,
    ApiOutlined,
    DatabaseOutlined,
    HddOutlined,
    DesktopOutlined,
    FormatPainterOutlined,
    FieldTimeOutlined,
    ThunderboltOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import './ProductCard.scss';

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(amount)
        .replace('₫', 'đ');
};

const ProductCard = ({ product }) => {
    // Fallback data if product is undefined
    const data = product || {
        name: "Laptop gaming Acer Nitro ProPanel ANV15",
        imageUrl: "https://via.placeholder.com/200x150?text=Laptop",
        price: 36790000,
        salePrice: 31990000,
        discount: 13,
        averageScore: 0.0,
        reviewsCount: 0,
        attributes: [
            { name: "CPU", value: "Core i7 240H", icon: <ApiOutlined /> },
            { name: "GPU", value: "RTX 3050", icon: <FormatPainterOutlined /> },
            { name: "RAM", value: "16 GB", icon: <DatabaseOutlined /> },
            { name: "Storage", value: "512 GB", icon: <HddOutlined /> },
            { name: "Screen", value: "15.6 Inch FHD", icon: <DesktopOutlined /> },
            { name: "Refresh", value: "180 Hz", icon: <FieldTimeOutlined /> },
            { name: "Battery", value: "57 Wh", icon: <ThunderboltOutlined /> },
            { name: "Weight", value: "2.1 Kg", icon: <ShoppingOutlined /> }
        ]
    };

    // Calculate discount if salePrice and price are provided but discount is missing
    const oldPrice = data.price;
    const newPrice = data.salePrice || data.price;
    const discountPercent = data.discount || (oldPrice > newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0);

    return (
        <div className="product-card">
            {/* Gift Icon Badge */}
            <div className="product-card__badge-gift">
                <GiftFilled />
            </div>

            {/* Product Image */}
            <div className="product-card__image-container">
                <img src={data.imageUrl} alt={data.name} className="product-card__image" />
            </div>

            <div className="product-card__content">
                {/* Product Name */}
                <h3 className="product-card__name" title={data.name}>
                    {data.name}
                </h3>

                {/* Specs Box */}
                {data.attributes && data.attributes.length > 0 && (
                    <div className="product-card__specs">
                        {data.attributes.map((attr, index) => (
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
                    <span className="rating-score">{data.averageScore.toFixed(1)}</span>
                    <StarFilled className="rating-star" />
                    <span className="rating-count">({data.reviewsCount} đánh giá)</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
