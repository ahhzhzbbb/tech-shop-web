import { useEffect, useMemo, useState } from 'react';
import { Rate, Spin, Empty, Avatar, Button, Modal } from 'antd';
import { UserOutlined, CommentOutlined } from '@ant-design/icons';
import { getRatingsByProductId } from '../services/rating.service.jsx';
import './ProductRatings.scss';

const MAX_VISIBLE = 5;

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const RatingList = ({ items }) => (
    <ul className="product-ratings__list">
        {items.map((rating) => (
            <li key={rating.id} className="product-ratings__item">
                <Avatar icon={<UserOutlined />} className="product-ratings__avatar" />
                <div className="product-ratings__body">
                    <div className="product-ratings__meta">
                        <span className="product-ratings__user">
                            {rating.userFullName || 'Người dùng ẩn danh'}
                        </span>
                        <Rate disabled value={rating.score} className="product-ratings__stars" />
                        <span className="product-ratings__date">{formatDate(rating.createdAt)}</span>
                    </div>

                    {rating.comment && (
                        <p className="product-ratings__comment">{rating.comment}</p>
                    )}
                </div>
            </li>
        ))}
    </ul>
);

/**
 * Danh sách đánh giá của một sản phẩm (hiển thị trong trang ProductDetail).
 *
 * @param {number|string} productId   - ID sản phẩm
 * @param {number}        refreshKey  - Thay đổi để buộc tải lại danh sách
 */
const ProductRatings = ({ productId, refreshKey = 0 }) => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!productId) return;

        let active = true;
        const fetchRatings = async () => {
            setLoading(true);
            try {
                const data = await getRatingsByProductId(productId);
                if (active) setRatings(Array.isArray(data) ? data : []);
            } catch {
                if (active) setRatings([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchRatings();
        return () => {
            active = false;
        };
    }, [productId, refreshKey]);

    const average = useMemo(() => {
        if (!ratings.length) return 0;
        const sum = ratings.reduce((acc, r) => acc + (r.score || 0), 0);
        return sum / ratings.length;
    }, [ratings]);

    return (
        <section className="product-ratings">
            <div className="product-ratings__head">
                <h2 className="product-ratings__title">
                    <CommentOutlined /> Đánh giá sản phẩm
                </h2>
                {ratings.length > 0 && (
                    <div className="product-ratings__summary">
                        <span className="product-ratings__avg">{average.toFixed(1)}</span>
                        <Rate disabled allowHalf value={average} />
                        <span className="product-ratings__count">({ratings.length} đánh giá)</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="product-ratings__status">
                    <Spin tip="Đang tải đánh giá..." />
                </div>
            ) : ratings.length === 0 ? (
                <Empty description="Chưa có đánh giá nào cho sản phẩm này" />
            ) : (
                <>
                    <RatingList items={ratings.slice(0, MAX_VISIBLE)} />

                    {ratings.length > MAX_VISIBLE && (
                        <div className="product-ratings__more">
                            <Button type="default" onClick={() => setModalOpen(true)}>
                                Xem thêm {ratings.length - MAX_VISIBLE} đánh giá
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Modal
                title={`Tất cả đánh giá (${ratings.length})`}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={720}
            >
                <RatingList items={ratings} />
            </Modal>
        </section>
    );
};

export default ProductRatings;
