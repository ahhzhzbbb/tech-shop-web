import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Alert, Empty, Rate, Tag, InputNumber, Button, message } from "antd";
import { ShoppingCartSimpleIcon } from "@phosphor-icons/react";

import productsService from "../services/products.service";
import cartService from "../../cart/service/cart.service";
import useCartStore from "../../../store/cartStore";
import ProductSideBar from "../components/ProductSidebar";
import ProductGallery from "../components/ProductGallery";
import ProductHighlights from "../components/ProductHighlights";
import ProductCard from "../components/ProductCard";
import "./Products.scss";
import "./ProductDetail.scss";

const RELATED_LIMIT = 20;

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
    const [messageApi, contextHolder] = message.useMessage();
    const setCartCount = useCartStore((s) => s.setCount);

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
        return () => {
            active = false;
        };
    }, [id]);

    // Sản phẩm cùng danh mục (loại bỏ sản phẩm hiện tại)
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
        return () => {
            active = false;
        };
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
        () =>
            (product?.attributes || []).map((attr) => ({
                label: attr.attributeName,
                value: attr.value,
            })),
        [product]
    );

    const handleAddToCart = async () => {
        if (!product?.id) return;
        setAdding(true);
        try {
            const data = await cartService.addToCart(product.id, 1);
            setCartCount(data?.totalItems);
            messageApi.success(`Đã thêm sản phẩm vào giỏ hàng.`);
        } catch (err) {
            messageApi.error(
                err?.response?.data?.message || err?.message || "Thêm vào giỏ hàng thất bại."
            );
        } finally {
            setAdding(false);
        }
    };

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
                        <h1 className="product-detail__name">{product.name}</h1>

                        <div className="product-detail__meta">
                            {product.brandName && (
                                <span className="product-detail__brand">
                                    Thương hiệu: <strong>{product.brandName}</strong>
                                </span>
                            )}
                            {product.categoryName && <Tag color="blue">{product.categoryName}</Tag>}
                        </div>

                        {product.averageScore != null && (
                            <div className="product-detail__rating">
                                <Rate disabled allowHalf value={product.averageScore} />
                                <span className="product-detail__score">
                                    {Number(product.averageScore).toFixed(1)}
                                </span>
                            </div>
                        )}

                        <div className="product-detail__price">{formatCurrency(product.price)}</div>

                        <div className="product-detail__stock">
                            {inStock ? (
                                <Tag color="green">Còn hàng ({product.quantity})</Tag>
                            ) : (
                                <Tag color="red">Hết hàng</Tag>
                            )}
                        </div>

                        <div className="product-detail__buy">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartSimpleIcon size={18} weight="fill" />}
                                onClick={handleAddToCart}
                                loading={adding}
                                disabled={!inStock}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                        </div>

                        {product.description && (
                            <p className="product-detail__description">{product.description}</p>
                        )}

                        <ProductHighlights specs={specs} />
                    </div>
                </div>

                {related.length > 0 && (
                    <section className="product-detail__related">
                        <h2 className="product-detail__related-title">Sản phẩm tương tự</h2>
                        <div className="products__grid">
                            {related.map((item) => (
                                <ProductCard
                                    key={item.id || item._id || item.code}
                                    product={item}
                                    categoryName={relatedCategory}
                                />
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
        </div>
    );
}

export default ProductDetail;
