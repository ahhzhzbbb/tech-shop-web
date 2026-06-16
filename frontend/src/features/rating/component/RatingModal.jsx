import { useState } from 'react';
import { Modal, Rate, Input, message } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { createRating } from '../services/rating.service.jsx';
import './RatingModal.scss';

const SCORE_LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

/**
 * Modal đánh giá một sản phẩm (chấm sao + bình luận).
 *
 * @param {boolean}  open        - Mở/đóng modal
 * @param {object}   product     - Sản phẩm cần đánh giá { productId, productName }
 * @param {function} onClose     - Callback khi đóng modal
 * @param {function} onSubmitted - Callback sau khi gửi đánh giá thành công (rating)
 */
const RatingModal = ({ open, product, onClose, onSubmitted }) => {
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const resetAndClose = () => {
        setScore(5);
        setComment('');
        onClose?.();
    };

    const handleSubmit = async () => {
        if (!product?.productId) return;
        if (!score) {
            message.warning('Vui lòng chọn số sao đánh giá.');
            return;
        }

        setSubmitting(true);
        try {
            const rating = await createRating({
                productId: product.productId,
                score,
                comment: comment.trim(),
            });
            message.success('Cảm ơn bạn đã đánh giá sản phẩm!');
            onSubmitted?.(rating);
            resetAndClose();
        } catch (err) {
            message.error(
                err?.response?.data?.message || err?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            rootClassName="rating-modal"
            title={
                <span className="rating-modal__title">Đánh giá sản phẩm</span>
            }
            okText="Gửi đánh giá"
            cancelText="Huỷ"
            onOk={handleSubmit}
            onCancel={resetAndClose}
            confirmLoading={submitting}
            okButtonProps={{ className: 'rating-modal__ok-btn' }}
            cancelButtonProps={{ className: 'rating-modal__cancel-btn' }}
            destroyOnClose
        >
            {product?.productName && (
                <p className="rating-modal__product-name">{product.productName}</p>
            )}

            <div className="rating-modal__stars">
                <Rate value={score} onChange={setScore} />
                <span className="rating-modal__score-label">{SCORE_LABELS[score]}</span>
            </div>

            <div className="rating-modal__comment">
                <Input.TextArea
                    rows={4}
                    maxLength={500}
                    showCount
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
        </Modal>
    );
};

export default RatingModal;
