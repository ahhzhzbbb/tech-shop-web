import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Alert, Empty, Row, Col, Select, InputNumber, Button } from "antd";

import productsService from "../services/products.service";
import ProductSideBar from "../../products/components/ProductSidebar";
import ProductCard from "../../products/components/ProductCard";
import "./Product.scss";

function Products() {
    const { category } = useParams();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("asc");
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();

    const fetchProducts = async ({ categoryName, sortBy, sortDir, minPrice, maxPrice } = {}) => {
        setLoading(true);
        setError(null);

        try {
            const data = await productsService.getProductsByCategoryName(categoryName, {
                sortBy,
                sortDir,
                minPrice,
                maxPrice,
                page: 0,
                size: 30,
            });

            const items = data?.products || data?.items || [];
            const pager = data?.pagination || data?.page || null;
            setProducts(items);
            setPagination(pager);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || String(err);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!category) return;
        fetchProducts({ categoryName: category, sortBy, sortDir, minPrice, maxPrice });
    }, [category]);

    const handleApplyFilters = () => {
        if (!category) return;
        fetchProducts({ categoryName: category, sortBy, sortDir, minPrice, maxPrice });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="products__status products__status--loading">
                    <Spin tip="Đang tải sản phẩm..." />
                </div>
            );
        }

        if (error) {
            return (
                <div className="products__status products__status--error">
                    <Alert message="Lỗi khi tải sản phẩm" description={error} type="error" showIcon />
                </div>
            );
        }

        if (!products || products.length === 0) {
            return (
                <div className="products__status products__status--empty">
                    <Empty description="Không có sản phẩm trong danh mục này" />
                </div>
            );
        }

        return (
            <div className="products__grid">
                {products.map((product) => (
                    <ProductCard key={product.id || product._id || product.code} product={product} />
                ))}
            </div>
        );
    };

    return (
        <div className="productLayout">
            <ProductSideBar />
            <div className="products__main">
                <h1 className="products__title">Danh mục: {category}</h1>
                <div className="products__controls">
                    <Row gutter={[12, 12]} align="middle">
                        <Col xs={24} sm={12} md={6}>
                            <label className="products__controlLabel">Sắp xếp</label>
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                options={[
                                    { value: "id", label: "Mới nhất" },
                                    { value: "name", label: "Tên A → Z" },
                                    { value: "price", label: "Giá" },
                                ]}
                                style={{ width: "100%" }}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <label className="products__controlLabel">Hướng</label>
                            <Select
                                value={sortDir}
                                onChange={setSortDir}
                                options={[
                                    { value: "asc", label: "Tăng dần" },
                                    { value: "desc", label: "Giảm dần" },
                                ]}
                                style={{ width: "100%" }}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <label className="products__controlLabel">Giá từ</label>
                            <InputNumber
                                value={minPrice}
                                onChange={(value) => setMinPrice(value)}
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="0"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <label className="products__controlLabel">Giá đến</label>
                            <InputNumber
                                value={maxPrice}
                                onChange={(value) => setMaxPrice(value)}
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="0"
                            />
                        </Col>
                        <Col xs={24}>
                            <Button type="primary" onClick={handleApplyFilters}>
                                Áp dụng lọc
                            </Button>
                        </Col>
                    </Row>
                </div>
                {pagination && (
                    <p className="products__count">{pagination.totalElements || pagination.total || 0} sản phẩm</p>
                )}
                {renderContent()}
            </div>
        </div>
    );
}

export default Products;