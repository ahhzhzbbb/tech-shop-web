import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

    useEffect(() => {
        if (!category) return;

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await productsService.getProductsByCategory(category);
                if (!response.ok) throw new Error(`Lỗi ${response.status}: Không thể tải sản phẩm`);

                const data = await response.json();
                setProducts(data.products || []);
                setPagination(data.pagination || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const renderContent = () => {
        if (loading) {
            return <div className="products__status">Đang tải sản phẩm...</div>;
        }

        if (error) {
            return <div className="products__status products__status--error">{error}</div>;
        }

        if (products.length === 0) {
            return <div className="products__status">Không có sản phẩm nào trong danh mục này.</div>;
        }

        return (
            <div className="products__grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        );
    };

    return (
        <div className="productLayout">
            <ProductSideBar />
            <div className="products__main">
                <h1 className="products__title">Danh mục: {category}</h1>
                {pagination && (
                    <p className="products__count">
                        {pagination.totalElements} sản phẩm
                    </p>
                )}
                {renderContent()}
            </div>
        </div>
    );
}

export default Products;