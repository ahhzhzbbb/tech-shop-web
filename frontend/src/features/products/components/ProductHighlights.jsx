import React, { useState } from 'react';
import './ProductHighlights.scss';

/**
 * Component hiển thị "Điểm nổi bật" - thông số kỹ thuật nổi bật của sản phẩm
 * 
 * @param {Array} specs - Mảng các thông số, mỗi phần tử có dạng { label: "CPU", value: "Intel Core i3..." }
 */
const ProductHighlights = ({ specs = [] }) => {
    const [expanded, setExpanded] = useState(false);

    // Số dòng hiển thị mặc định (không mở rộng)
    const DEFAULT_VISIBLE = 6;
    const hasMore = specs.length > DEFAULT_VISIBLE;
    const visibleSpecs = expanded ? specs : specs.slice(0, DEFAULT_VISIBLE);

    if (!specs || specs.length === 0) return null;

    return (
        <div className="product-highlights">
            <div className="product-highlights__header">
                <span className="product-highlights__title">ĐIỂM NỔI BẬT</span>
            </div>

            <table className="product-highlights__table">
                <tbody>
                    {visibleSpecs.map((spec, idx) => (
                        <tr key={idx} className="product-highlights__row">
                            <td className="product-highlights__label">{spec.label}</td>
                            <td className="product-highlights__value">{spec.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Nút mở rộng nếu có nhiều hơn DEFAULT_VISIBLE specs */}
            {hasMore && !expanded && (
                <button
                    className="product-highlights__expand"
                    onClick={() => setExpanded(true)}
                >
                    Xem thêm
                </button>
            )}


        </div>
    );
};

export default ProductHighlights;
